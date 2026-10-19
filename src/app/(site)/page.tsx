import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  GoogleIcon,
  PhoneIcon,
  StarFilledIcon,
} from "@/components/Icons";
import { ServiceCard } from "@/components/site/ServiceCard";
import { formatPrice } from "@/lib/format";
import { formatRating, getGoogleReviews } from "@/lib/google-reviews";
import { getPublishedServices, getSettings, startingPrice } from "@/lib/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, services, google] = await Promise.all([
    getSettings(),
    getPublishedServices(),
    getGoogleReviews(),
  ]);

  // Sans cle d'API, on se rabat sur la note saisie dans les reglages : la
  // section garde du sens, elle perd seulement les citations.
  const rating = google ? formatRating(google.rating) : settings.googleRating;
  const reviewCount = google ? google.reviewCount : settings.googleReviewCount;
  const reviewsUrl =
    google?.mapsUrl ?? settings.googleReviewsUrl ?? settings.googleUrl;
  const reviews = (google?.reviews ?? []).slice(0, 3);

  const highlighted = services.filter((s) => s.featured).slice(0, 3);
  const pricingTeaser = highlighted.length === 3 ? highlighted : services.slice(0, 3);
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <>
      {/* ── Hero — photo plein ecran, texte ancre en bas ──────────────────── */}
      <section className="relative -mt-[var(--header-h)] flex min-h-[92vh] flex-col justify-end overflow-hidden bg-dark text-on-dark">
        <Image
          src="/hero-atelier.jpg"
          alt="Dorian lavant une Ferrari FF à la mousse active devant l'atelier de Braine-l'Alleud"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />

        {/* Deux voiles. Bas : la photo est claire, le texte blanc a besoin
            d'un fond franc. Haut : sans lui, la nav blanche de l'en-tete
            transparente passerait sur le ciel pale. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.94) 10%, rgba(10,10,10,0.72) 38%, rgba(10,10,10,0.38) 68%, rgba(10,10,10,0.3) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[220px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.72), rgba(10,10,10,0))",
          }}
        />
        {/* Voile lateral : le texte longe la carrosserie blanche, qui ferait
            chuter le contraste. Il s'arrete a 72% pour ne pas eteindre la
            partie droite de la photo. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.45) 38%, rgba(10,10,10,0) 72%)",
          }}
        />

        <div className="shell relative z-10 pt-[calc(var(--header-h)+5rem)]">
          <p className="eyebrow eyebrow-light">Centre de detailing — Braine-l&apos;Alleud</p>
          <h1 className="mb-5 mt-4 max-w-[760px] text-[clamp(32px,5vw,62px)] font-bold leading-[1.03]">
            {settings.heroTitle}
          </h1>
          <p className="mb-8 max-w-[480px] text-[16px] leading-relaxed text-on-dark">
            {settings.heroText}
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link href="/contact" className="btn btn-accent px-7 py-4 text-[15px]">
              Demander un rendez-vous
            </Link>
            <Link href="/tarifs" className="btn btn-ghost-dark px-7 py-4 text-[15px]">
              Voir les formules
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-12 border-t border-dark-line">
          {/* Le libelle visible EST le <dt> : un <dt> masque en plus le faisait
              annoncer deux fois, et un <p> est invalide a cet endroit dans un
              <dl>. flex-row-reverse affiche la valeur avant son libelle sans
              casser l'ordre dt/dd attendu dans le DOM. */}
          <dl className="shell flex flex-wrap justify-center gap-x-12 gap-y-4 py-6">
            <div className="flex flex-row-reverse items-baseline gap-2.5">
              <dt className="text-[12.5px] text-on-dark-faint">véhicules traités</dt>
              <dd className="disp text-[22px] font-bold">{settings.statVehicles}</dd>
            </div>
            <div className="flex flex-row-reverse items-baseline gap-2.5">
              <dt className="text-[12.5px] text-on-dark-faint">avis clients</dt>
              <dd className="disp text-[22px] font-bold">{settings.statRating}</dd>
            </div>
            <div className="flex flex-row-reverse items-baseline gap-2.5">
              <dt className="text-[12.5px] text-on-dark-faint">travail à la main</dt>
              <dd className="disp text-[22px] font-bold">100%</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Prestations ────────────────────────────────────────────────────── */}
      <section id="services" className="border-t border-line py-16 md:py-20">
        <div className="shell">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Nos prestations</p>
              <h2 className="mt-3 text-[clamp(26px,3vw,36px)] font-bold">
                Un soin pour chaque besoin
              </h2>
            </div>
            <p className="max-w-[380px] text-[14.5px] leading-relaxed text-ink-dim">
              De la remise en forme express à la transformation complète, chaque formule
              est pensée pour un résultat qui dure.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarifs (aperçu) ────────────────────────────────────────────────── */}
      <section
        id="tarifs"
        className="bg-dark py-16 md:py-20 text-on-dark"
      >
        <div className="shell">
          <div className="mx-auto mb-11 max-w-[560px] text-center">
            <p className="eyebrow eyebrow-light">Tarifs</p>
            <h2 className="mb-2.5 mt-3 text-[clamp(26px,3vw,34px)] font-bold">
              Des formules claires, sans surprise
            </h2>
            <p className="text-[14.5px] leading-relaxed text-on-dark-dim">
              Le tarif dépend du gabarit du véhicule et de son état général. Un devis
              précis est toujours confirmé avant intervention.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pricingTeaser.map((service, index) => {
              const from = startingPrice(service);
              const isCenter = index === 1;
              return (
                <div
                  key={service.id}
                  className={`card-dark relative flex flex-col p-8 ${
                    isCenter ? "border-accent" : ""
                  }`}
                >
                  {isCenter && (
                    <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-accent-ink">
                      {service.badge?.toUpperCase() ?? "LA PLUS CHOISIE"}
                    </span>
                  )}
                  <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-wider text-on-dark-dim">
                    {service.name}
                  </p>
                  <p className="disp mb-1 text-[30px] font-bold">
                    {from === null ? "Sur devis" : `dès ${formatPrice(from)}`}
                  </p>
                  <p className="mb-6 text-[12.5px] text-on-dark-faint">
                    selon gabarit du véhicule
                  </p>
                  <ul className="mb-7 flex flex-col gap-2.5 text-[13.5px] text-on-dark-dim">
                    {service.inclusions.slice(0, 4).map((inclusion) => (
                      <li key={inclusion.id}>— {inclusion.label}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/prestations/${service.slug}`}
                    className={`btn mt-auto w-full ${
                      isCenter ? "btn-accent" : "btn-ghost-dark"
                    }`}
                  >
                    Voir le détail
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-7 text-center">
            <Link href="/tarifs" className="text-[13.5px] font-semibold text-accent">
              Voir la grille tarifaire complète (par gabarit) →
            </Link>
          </p>
        </div>
      </section>

      <section id="avis" className="border-b border-line bg-surface py-16 md:py-20">
        <div className="shell">
          <div className="mx-auto mb-9 max-w-[520px] text-center">
            <p className="eyebrow">Ils nous ont recommandés</p>
            <h2 className="mt-3 text-[clamp(26px,3vw,34px)] font-bold">
              La satisfaction client avant tout
            </h2>
          </div>

          {/* Bandeau de note. Les chiffres viennent de l'API Google, donc ils
              suivent la fiche sans intervention. Le lien reste en evidence :
              une note affichee doit toujours etre verifiable d'un clic. */}
          <div className="card mx-auto flex max-w-[780px] flex-col items-center gap-5 px-6 py-5 text-center sm:flex-row sm:justify-between sm:gap-8 sm:text-left">
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2">
                <GoogleIcon size={21} />
              </span>
              <div>
                <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                  <span className="disp text-[28px] font-bold leading-none">
                    {rating}
                  </span>
                  <span
                    className="flex gap-0.5 text-accent-deep"
                    aria-label={`Note de ${rating} sur 5`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarFilledIcon key={index} size={14} />
                    ))}
                  </span>
                </div>
                <p className="mt-1.5 text-[13.5px] text-ink-dim">
                  {reviewCount} avis Google
                </p>
              </div>
            </div>

            {reviewsUrl && (
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm shrink-0"
              >
                Voir tous les avis
                <ArrowRightIcon size={14} />
              </a>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <figure key={review.id} className="card flex flex-col p-6">
                  <div
                    className="mb-3.5 flex gap-0.5 text-accent-deep"
                    aria-label={`${review.rating} étoiles sur 5`}
                  >
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <StarFilledIcon key={index} size={14} />
                    ))}
                  </div>

                  <blockquote className="text-sm leading-relaxed text-ink-dim">
                    {review.text}
                  </blockquote>

                  <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    {/* Initiale plutot que la photo de profil : pas de requete
                        vers googleusercontent, et un rendu homogene quel que
                        soit l'avatar du client. */}
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent-deep"
                    >
                      {review.author.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold">
                        {review.author}
                      </span>
                      {review.publishedAgo && (
                        <span className="block text-[12px] text-ink-faint">
                          {review.publishedAgo}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bannière contact ───────────────────────────────────────────────── */}
      <section className="flex w-full justify-center bg-dark px-5 py-16 md:px-8 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-8 rounded-[24px] border border-accent/30 p-8 md:p-12">
          <div className="max-w-[560px]">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-accent">
              Zone d&apos;intervention — Brabant wallon
            </p>
            <h2 className="disp mb-3 mt-3.5 text-[clamp(24px,2.8vw,32px)] font-bold text-on-dark">
              Un message ou un appel, et c&apos;est parti
            </h2>
            <p className="text-[14.5px] leading-relaxed text-on-dark-dim">
              Atelier basé à Braine-l&apos;Alleud — intervention sur rendez-vous dans tout
              le Brabant wallon. Contactez-nous avec la formule souhaitée, on revient vers
              vous rapidement pour fixer votre créneau.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3.5">
            <Link
              href="/contact"
              className="btn btn-light px-8 py-4 text-[15px]"
            >
              Nous contacter
              <ArrowRightIcon size={15} />
            </Link>
            <a
              href={telHref}
              className="flex items-center gap-2 text-sm font-semibold text-on-dark-dim"
            >
              <PhoneIcon size={15} />
              {settings.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
