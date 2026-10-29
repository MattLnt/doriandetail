import type { Settings } from "@/lib/queries";

/**
 * L'adresse canonique du site. Le domaine repond sur l'apex et sur www ;
 * www redirige vers l'apex (voir next.config.ts), et toutes les URL
 * canoniques pointent ici — sans quoi Google indexe deux fois chaque page.
 */
export const SITE_URL = "https://doriandetailing.be";

export const SITE_NAME = "Dorian Detailing";

/**
 * Un numero belge sans indicatif ne declenche pas l'appel sur tous les
 * telephones (ni depuis l'etranger) : on force le format international.
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^0-9+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("00")) return `tel:+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `tel:+32${digits.slice(1)}`;
  return `tel:${digits}`;
}

/** « tel:+32493419126 » → « +32 493 41 91 26 », pour les donnees structurees. */
function telPlain(phone: string): string {
  return telHref(phone).replace("tel:", "");
}

const DAY_MAP: Record<string, string> = {
  lun: "Monday",
  mar: "Tuesday",
  mer: "Wednesday",
  jeu: "Thursday",
  ven: "Friday",
  sam: "Saturday",
  dim: "Sunday",
};

/**
 * Les horaires sont saisis en texte libre dans le dashboard
 * (« Lun - Ven : 9h - 18h »). On en tire ce qu'on peut pour le schema ;
 * une ligne qu'on ne sait pas lire est simplement ignoree, le reste du
 * balisage reste valide.
 */
function openingHours(hours: string) {
  const specs: { "@type": "OpeningHoursSpecification"; dayOfWeek: string[]; opens: string; closes: string }[] = [];

  for (const line of hours.split("\n")) {
    const match = line
      .toLowerCase()
      .match(/^\s*([a-zéû]{3})[a-zéû]*\s*(?:-\s*([a-zéû]{3})[a-zéû]*)?\s*:\s*(\d{1,2})\s*h\s*(\d{2})?\s*-\s*(\d{1,2})\s*h\s*(\d{2})?/);
    if (!match) continue;

    const [, from, to, openH, openM, closeH, closeM] = match;
    const order = Object.keys(DAY_MAP);
    const start = order.indexOf(from);
    if (start < 0) continue;
    const end = to ? order.indexOf(to) : start;
    const days = order
      .slice(start, (end < 0 ? start : end) + 1)
      .map((key) => DAY_MAP[key]);

    specs.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens: `${openH.padStart(2, "0")}:${openM ?? "00"}`,
      closes: `${closeH.padStart(2, "0")}:${closeM ?? "00"}`,
    });
  }

  return specs;
}

/**
 * Fiche d'etablissement pour Google. C'est ce balisage qui permet au site
 * de ressortir sur les recherches locales (« detailing Braine-l'Alleud »)
 * et d'afficher horaires et bouton d'appel dans les resultats.
 *
 * Pas d'aggregateRating ici : Google interdit les avis auto-declares sur sa
 * propre fiche (LocalBusiness/Organization) et rejette le balisage.
 */
export function localBusinessJsonLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDetailing",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/hero-atelier.jpg`,
    logo: `${SITE_URL}/logo.png`,
    telephone: telPlain(settings.phone),
    email: settings.email,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine,
      postalCode: settings.city.replace(/\D/g, "") || undefined,
      addressLocality: settings.city.replace(/^\d+\s*/, ""),
      addressCountry: "BE",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Brabant wallon" },
      { "@type": "City", name: "Braine-l'Alleud" },
      { "@type": "City", name: "Waterloo" },
      { "@type": "City", name: "Nivelles" },
    ],
    openingHoursSpecification: openingHours(settings.hours),
    sameAs: [settings.googleUrl, settings.instagram, settings.facebook, settings.tiktok].filter(
      (value): value is string => Boolean(value),
    ),
  };
}

/** Balisage d'une prestation, rattache a l'etablissement. */
export function serviceJsonLd(service: { name: string; slug: string; tagline?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.tagline ?? undefined,
    url: `${SITE_URL}/prestations/${service.slug}`,
    serviceType: "Detailing automobile",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "AdministrativeArea", name: "Brabant wallon" },
  };
}

/** `<script type="application/ld+json">` — a poser dans n'importe quelle page. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Donnees internes, pas de saisie visiteur : pas d'echappement a prevoir.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
