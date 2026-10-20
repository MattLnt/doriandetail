import type { Metadata } from "next";
import Link from "next/link";

import { PriceGrid } from "@/components/site/PriceGrid";
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
          {/* La mention TTC doit rester lisible sans avoir a lire le paragraphe :
              c'est une information de prix, pas une precision de contexte. */}
          <p className="mt-5 inline-flex rounded-full border border-line bg-surface px-4 py-2 text-[13.5px] font-semibold">
            Tous les prix sont affichés TTC.
          </p>
        </div>
      </section>

      {/* ── Grille principale ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-14">
        <div className="shell">
          <PriceGrid services={services} vehicleClasses={vehicleClasses} />

          <p className="hint">
            Tous les montants de la grille sont TTC. Les prix barrés signalent une
            promotion en cours. « Sur devis » : une inspection du véhicule est
            nécessaire avant chiffrage.
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
              À ajouter à la formule de votre choix, prix TTC. Les options disponibles
              varient selon la prestation : le détail figure sur chaque fiche.
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
