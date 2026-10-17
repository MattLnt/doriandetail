import Link from "next/link";

import {
  ArrowRightIcon,
  ImageIcon,
  PhoneIcon,
  SparkleIcon,
  StarFilledIcon,
} from "@/components/Icons";
import { ServiceCard } from "@/components/site/ServiceCard";
import { formatPrice } from "@/lib/format";
import {
  getPublishedServices,
  getPublishedTestimonials,
  getSettings,
  startingPrice,
} from "@/lib/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, services, testimonials] = await Promise.all([
    getSettings(),
    getPublishedServices(),
    getPublishedTestimonials(),
  ]);

  const highlighted = services.filter((s) => s.featured).slice(0, 3);
  const pricingTeaser = highlighted.length === 3 ? highlighted : services.slice(0, 3);
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-0 py-16 md:py-24">
        <div
          className="pointer-events-none absolute -right-40 -top-56 h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(194,136,122,0.20), transparent 70%)",
          }}
        />
        <div className="shell relative flex flex-wrap items-center gap-12 lg:gap-16">
          <div className="min-w-0 flex-1 basis-[480px]">
            <p className="eyebrow">Centre de detailing — Braine-l&apos;Alleud</p>
            <h1 className="mb-5 mt-4 text-[clamp(34px,4.6vw,58px)] font-bold leading-[1.04]">
              {settings.heroTitle}
            </h1>
            <p className="mb-8 max-w-[480px] text-[17px] leading-relaxed text-ink-dim">
              {settings.heroText}
            </p>
            <div className="mb-11 flex flex-wrap gap-3.5">
              <Link href="/contact" className="btn btn-primary px-7 py-4 text-[15px]">
                Demander un rendez-vous
              </Link>
              <Link href="/tarifs" className="btn btn-ghost px-7 py-4 text-[15px]">
                Voir les formules
              </Link>
            </div>

            <dl className="flex max-w-[480px] flex-wrap gap-9 border-t border-line pt-7">
              <div>
                <dt className="sr-only">Véhicules traités</dt>
                <dd className="disp text-[26px] font-bold">{settings.statVehicles}</dd>
                <p className="text-[12.5px] text-ink-faint">véhicules traités</p>
              </div>
              <div>
                <dt className="sr-only">Avis clients</dt>
                <dd className="disp text-[26px] font-bold">{settings.statRating}</dd>
                <p className="text-[12.5px] text-ink-faint">avis clients</p>
              </div>
              <div>
                <dt className="sr-only">Travail à la main</dt>
                <dd className="disp text-[26px] font-bold">100%</dd>
                <p className="text-[12.5px] text-ink-faint">travail à la main</p>
              </div>
            </dl>
          </div>

          <div className="relative min-w-[300px] flex-1 basis-[420px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-[#F2EEEA] to-[#E6E0D9]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-ink-faint">
                <ImageIcon size={54} />
                <span className="text-xs tracking-wide">
                  photo véhicule traité — à intégrer
                </span>
              </div>
            </div>
            <div className="card absolute bottom-6 left-0 flex items-center gap-3 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)] lg:-left-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                <SparkleIcon size={20} strokeWidth={2} />
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold">
                  Traitement céramique
                </span>
                <span className="block text-xs text-ink-faint">
                  brillance &amp; protection longue durée
                </span>
              </span>
            </div>
          </div>
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
        className="border-y border-line bg-surface py-16 md:py-20"
      >
        <div className="shell">
          <div className="mx-auto mb-11 max-w-[560px] text-center">
            <p className="eyebrow">Tarifs</p>
            <h2 className="mb-2.5 mt-3 text-[clamp(26px,3vw,34px)] font-bold">
              Des formules claires, sans surprise
            </h2>
            <p className="text-[14.5px] leading-relaxed text-ink-dim">
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
                  className={`card relative flex flex-col p-8 ${
                    isCenter ? "border-accent" : ""
                  }`}
                >
                  {isCenter && (
                    <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-accent-ink">
                      {service.badge?.toUpperCase() ?? "LA PLUS CHOISIE"}
                    </span>
                  )}
                  <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-wider text-ink-dim">
                    {service.name}
                  </p>
                  <p className="disp mb-1 text-[30px] font-bold">
                    {from === null ? "Sur devis" : `dès ${formatPrice(from)}`}
                  </p>
                  <p className="mb-6 text-[12.5px] text-ink-faint">
                    selon gabarit du véhicule
                  </p>
                  <ul className="mb-7 flex flex-col gap-2.5 text-[13.5px] text-ink-dim">
                    {service.inclusions.slice(0, 4).map((inclusion) => (
                      <li key={inclusion.id}>— {inclusion.label}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/prestations/${service.slug}`}
                    className={`btn mt-auto w-full ${
                      isCenter ? "btn-primary" : "btn-ghost"
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

      {/* ── Avis ───────────────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section id="avis" className="border-b border-line py-16 md:py-20">
          <div className="shell">
            <div className="mx-auto mb-11 max-w-[520px] text-center">
              <p className="eyebrow">Ils nous ont recommandés</p>
              <h2 className="mt-3 text-[clamp(26px,3vw,34px)] font-bold">
                La satisfaction client avant tout
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.id} className="card p-7">
                  <div
                    className="mb-3.5 flex gap-0.5 text-accent"
                    aria-label={`${testimonial.rating} étoiles sur 5`}
                  >
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <StarFilledIcon key={index} size={15} />
                    ))}
                  </div>
                  <blockquote className="mb-5 text-sm leading-relaxed text-ink-dim">
                    « {testimonial.content} »
                  </blockquote>
                  <figcaption className="text-[13px] font-semibold">
                    {testimonial.author}
                    {testimonial.location ? ` — ${testimonial.location}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bannière contact ───────────────────────────────────────────────── */}
      <section className="flex w-full justify-center bg-dark px-5 py-16 md:px-8 md:py-20">
        <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-8 rounded-[24px] border border-accent/30 p-8 md:p-12">
          <div className="max-w-[560px]">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-accent">
              Zone d&apos;intervention — Brabant wallon
            </p>
            <h2 className="disp mb-3 mt-3.5 text-[clamp(24px,2.8vw,32px)] font-bold text-[#FAF8F6]">
              Un message ou un appel, et c&apos;est parti
            </h2>
            <p className="text-[14.5px] leading-relaxed text-[#B5AEA7]">
              Atelier basé à Braine-l&apos;Alleud — intervention sur rendez-vous dans tout
              le Brabant wallon. Contactez-nous avec la formule souhaitée, on revient vers
              vous rapidement pour fixer votre créneau.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3.5">
            <Link
              href="/contact"
              className="btn bg-[#FAF8F6] px-8 py-4 text-[15px] text-ink"
            >
              Nous contacter
              <ArrowRightIcon size={15} />
            </Link>
            <a
              href={telHref}
              className="flex items-center gap-2 text-sm font-semibold text-[#D8D2CB]"
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
