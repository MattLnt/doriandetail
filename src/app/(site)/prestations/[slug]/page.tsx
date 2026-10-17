import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckIcon, PhoneIcon, ServiceIcon } from "@/components/Icons";
import { PriceTable } from "@/components/site/PriceTable";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug, getSettings } from "@/lib/queries";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Prestation introuvable" };
  return {
    title: service.name,
    description: service.tagline ?? undefined,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSettings()]);
  if (!service) notFound();

  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <>
      <section className="border-b border-line py-12 md:py-16">
        <div className="shell">
          <nav aria-label="Fil d'Ariane" className="mb-7 text-[13px] text-ink-faint">
            <Link href="/prestations" className="hover:text-ink">
              Prestations
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-dim">{service.name}</span>
          </nav>

          <div className="flex flex-wrap items-start gap-10 lg:gap-16">
            <div className="min-w-0 flex-1 basis-[520px]">
              <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-accent-soft text-accent">
                <ServiceIcon name={service.icon} size={26} />
              </span>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {service.group && <span className="badge">{service.group.name}</span>}
                {service.badge && (
                  <span className="badge badge-accent">{service.badge}</span>
                )}
              </div>

              <h1 className="mb-4 mt-4 text-[clamp(28px,3.6vw,42px)] font-bold leading-tight">
                {service.name}
              </h1>
              {service.tagline && (
                <p className="max-w-[620px] text-[16.5px] leading-relaxed text-ink-dim">
                  {service.tagline}
                </p>
              )}
              {service.description && (
                <p className="mt-4 max-w-[620px] text-[14px] leading-relaxed text-ink-faint">
                  {service.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/contact?prestation=${service.slug}`}
                  className="btn btn-primary"
                >
                  Demander cette formule
                </Link>
                <a href={telHref} className="btn btn-ghost">
                  <PhoneIcon size={15} />
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="min-w-[300px] flex-1 basis-[360px]">
              <h2 className="mb-3.5 text-[13px] font-semibold uppercase tracking-wider text-ink-dim">
                Tarifs par gabarit
              </h2>
              <PriceTable service={service} />
              <p className="hint">
                Tarifs indicatifs TTC. Le devis définitif est confirmé avant intervention,
                selon l&apos;état réel du véhicule. Paiement à l&apos;atelier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inclus ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface py-14 md:py-16">
        <div className="shell">
          <p className="eyebrow">Ce qui est inclus</p>
          <h2 className="mb-9 mt-3 text-[clamp(24px,2.6vw,30px)] font-bold">
            Le détail de la prestation
          </h2>

          <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {service.inclusions.map((inclusion) => (
              <li key={inclusion.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <CheckIcon size={11} />
                </span>
                <span className="text-[14px] leading-relaxed text-ink-dim">
                  {inclusion.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Options ────────────────────────────────────────────────────────── */}
      {service.options.length > 0 && (
        <section className="border-b border-line py-14 md:py-16">
          <div className="shell">
            <p className="eyebrow">En supplément</p>
            <h2 className="mb-3 mt-3 text-[clamp(24px,2.6vw,30px)] font-bold">
              Options disponibles
            </h2>
            <p className="mb-9 max-w-[560px] text-[14.5px] leading-relaxed text-ink-dim">
              Ces prestations peuvent être ajoutées à la formule {service.name}. Signalez-les
              dans votre demande, nous les intégrons au devis.
            </p>

            <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {service.options.map(({ option }) => (
                <li key={option.id} className="card flex items-start gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold leading-snug">
                      {option.name}
                    </p>
                    {option.description && (
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <span className="disp flex-shrink-0 text-[15px] font-bold text-accent">
                    +{formatPrice(option.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="flex w-full justify-center bg-dark px-5 py-14 md:px-8 md:py-16">
        <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-7 rounded-[24px] border border-accent/30 p-8 md:p-11">
          <div className="max-w-[520px]">
            <h2 className="disp mb-2.5 text-[clamp(22px,2.6vw,28px)] font-bold text-[#FAF8F6]">
              Intéressé par la formule {service.name} ?
            </h2>
            <p className="text-[14.5px] leading-relaxed text-[#B5AEA7]">
              Envoyez-nous votre demande avec le modèle de votre véhicule. On vous répond
              rapidement avec un créneau et un devis confirmé. Aucun paiement en ligne :
              le règlement se fait à l&apos;atelier.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3.5">
            <Link
              href={`/contact?prestation=${service.slug}`}
              className="btn bg-[#FAF8F6] px-8 py-4 text-[15px] text-ink"
            >
              Demander un rendez-vous
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
