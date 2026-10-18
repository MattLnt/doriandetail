import type { Metadata } from "next";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { getPublishedOptions, getPublishedServices, getVehicleClasses } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Grille tarifaire",
  description:
    "Tous les tarifs de l'atelier Dorian Detailing, par prestation et par gabarit de véhicule, ainsi que les options en supplément.",
};

export default async function TarifsPage() {
  const [services, vehicleClasses, options] = await Promise.all([
    getPublishedServices(),
    getVehicleClasses(),
    getPublishedOptions(),
  ]);

  return (
    <>
      <section className="border-b border-line py-14 md:py-16">
        <div className="shell max-w-[720px]">
          <p className="eyebrow">Tarifs</p>
          <h1 className="mb-4 mt-3 text-[clamp(30px,4vw,44px)] font-bold leading-tight">
            Grille tarifaire complète
          </h1>
          <p className="text-[16px] leading-relaxed text-ink-dim">
            Le tarif dépend du gabarit du véhicule et de son état général. Les montants
            ci-dessous sont indicatifs : un devis précis est toujours confirmé avant
            intervention. Le paiement se fait à l&apos;atelier, aucun règlement en ligne.
          </p>
        </div>
      </section>

      {/* ── Grille principale ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-14">
        <div className="shell">
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Tarifs de chaque prestation selon le gabarit du véhicule
              </caption>
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th
                    scope="col"
                    className="px-5 py-4 text-[12px] font-semibold uppercase tracking-wider text-ink-dim"
                  >
                    Prestation
                  </th>
                  {vehicleClasses.map((vc) => (
                    <th
                      key={vc.id}
                      scope="col"
                      className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-wider text-ink-dim"
                    >
                      {vc.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const byVehicle = new Map(
                    service.prices.map((p) => [p.vehicleClassId, p]),
                  );
                  return (
                    <tr key={service.id} className="border-b border-line last:border-0">
                      <th scope="row" className="px-5 py-4 align-top">
                        <Link
                          href={`/prestations/${service.slug}`}
                          className="text-[14px] font-semibold hover:text-accent-deep"
                        >
                          {service.name}
                        </Link>
                        {service.group && (
                          <span className="mt-1 block text-[12px] font-normal text-ink-faint">
                            {service.group.name}
                          </span>
                        )}
                      </th>
                      {vehicleClasses.map((vc) => {
                        const price = byVehicle.get(vc.id);
                        const amount = price?.promoCents ?? price?.priceCents ?? null;
                        const hasPromo =
                          price?.promoCents !== null &&
                          price?.promoCents !== undefined &&
                          price?.priceCents !== null;
                        return (
                          <td
                            key={vc.id}
                            className="whitespace-nowrap px-5 py-4 text-right align-top"
                          >
                            {service.quoteOnly || amount === null ? (
                              <span className="text-[13px] text-ink-faint">Sur devis</span>
                            ) : hasPromo ? (
                              <span className="inline-flex flex-col items-end">
                                <span className="text-[12px] text-ink-faint line-through">
                                  {formatPrice(price!.priceCents)}
                                </span>
                                <span className="disp text-[14.5px] font-bold text-accent-deep">
                                  {formatPrice(amount)}
                                </span>
                              </span>
                            ) : (
                              <span className="disp text-[14.5px] font-bold">
                                {formatPrice(amount)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="hint">
            Les prix barrés signalent une promotion en cours. « Sur devis » : une
            inspection du véhicule est nécessaire avant chiffrage.
          </p>
        </div>
      </section>

      {/* ── Options ────────────────────────────────────────────────────────── */}
      {options.length > 0 && (
        <section className="border-y border-line bg-surface py-14 md:py-16">
          <div className="shell">
            <p className="eyebrow">Suppléments</p>
            <h2 className="mb-3 mt-3 text-[clamp(24px,2.6vw,32px)] font-bold">
              Options à la carte
            </h2>
            <p className="mb-9 max-w-[560px] text-[14.5px] leading-relaxed text-ink-dim">
              À ajouter à la formule de votre choix. Les options disponibles varient selon
              la prestation : le détail figure sur chaque fiche.
            </p>

            <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {options.map((option) => (
                <li
                  key={option.id}
                  className="flex items-start justify-between gap-4 rounded-[14px] border border-line bg-white p-5"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-semibold leading-snug">
                      {option.name}
                    </p>
                    {option.description && (
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">
                        {option.description}
                      </p>
                    )}
                  </div>
                  <span className="disp flex-shrink-0 text-[15px] font-bold text-accent-deep">
                    +{formatPrice(option.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="shell flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-ink-dim">
            Un doute sur le gabarit de votre véhicule ou sur la formule adaptée ?
            Écrivez-nous, on vous répond avec un tarif ferme.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
