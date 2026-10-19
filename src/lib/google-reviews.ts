/**
 * Avis Google, recuperes directement depuis l'API Places (New).
 *
 * Deux limites viennent de Google, pas du code :
 *
 * 1. L'API ne renvoie que 5 avis maximum, choisis par Google selon sa propre
 *    notion de pertinence. On ne peut ni en demander davantage, ni choisir
 *    lesquels. Les 140 avis de la fiche ne sont donc pas tous accessibles.
 * 2. Les conditions d'utilisation interdisent de conserver le contenu des avis
 *    plus de 30 jours. Le cache est fixe a 24 h : assez pour ne pas facturer un
 *    appel par visiteur, largement sous la limite.
 *
 * Sans `GOOGLE_PLACES_API_KEY`, la fonction renvoie `null` et la page se rabat
 * sur la note saisie dans les reglages. Le site ne casse pas, il affiche juste
 * la note sans les citations.
 */

/** Fiche Google Business de Dorian Detailing. */
const PLACE_ID = "ChIJV7m92q3Nw0cRNMUZP5oab2k";

const ENDPOINT = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = "rating,userRatingCount,googleMapsUri,reviews";

/** 24 h. Voir la limite des 30 jours ci-dessus. */
const CACHE_SECONDS = 86_400;

export type GoogleReview = {
  id: string;
  author: string;
  profileUrl: string | null;
  rating: number;
  text: string;
  /** « il y a 2 mois », tel que Google le formule. */
  publishedAgo: string;
};

export type GoogleReviews = {
  /** Note moyenne, ex. 5 ou 4.9. */
  rating: number;
  reviewCount: number;
  /** Lien vers la fiche, fourni par l'API elle-meme. */
  mapsUrl: string | null;
  reviews: GoogleReview[];
};

type ApiReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
};

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${ENDPOINT}?languageCode=fr`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!response.ok) {
      // Les causes courantes : cle restreinte au mauvais referrer, API Places
      // non activee sur le projet, facturation absente.
      console.error(
        `[avis Google] ${response.status} ${response.statusText} — ${await response
          .text()
          .catch(() => "")}`,
      );
      return null;
    }

    const data: {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: ApiReview[];
    } = await response.json();

    if (typeof data.rating !== "number") return null;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((review, index) => ({
        id: review.name ?? `avis-${index}`,
        author: review.authorAttribution?.displayName?.trim() ?? "",
        profileUrl: review.authorAttribution?.uri ?? null,
        rating: review.rating ?? 0,
        // `text` est la version traduite en francais, `originalText` la langue
        // d'origine. On prend la traduction quand elle existe.
        text: (review.text?.text ?? review.originalText?.text ?? "").trim(),
        publishedAgo: review.relativePublishTimeDescription ?? "",
      }))
      // Un avis peut etre une note seule, sans commentaire : inaffichable ici.
      .filter((review) => review.text.length > 0 && review.author.length > 0);

    return {
      rating: data.rating,
      reviewCount: data.userRatingCount ?? 0,
      mapsUrl: data.googleMapsUri ?? null,
      reviews,
    };
  } catch (error) {
    console.error("[avis Google] appel impossible", error);
    return null;
  }
}

/** 5 -> « 5,0 ». Google renvoie un nombre, la page affiche une virgule. */
export function formatRating(rating: number) {
  return rating.toFixed(1).replace(".", ",");
}
