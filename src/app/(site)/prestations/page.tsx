import type { Metadata } from "next";
import Link from "next/link";

import { ContentUnavailable } from "@/components/site/ContentUnavailable";
import { ServiceCard } from "@/components/site/ServiceCard";
import { getPublishedServicesOrEmpty } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Prestations",
  description:
    "Toutes les formules de l'atelier Dorian Detailing : nettoyage, reconditionnement, polissage, traitement céramique et abonnement d'entretien.",
};

export default async function PrestationsPage() {
  const services = await getPublishedServicesOrEmpty();

  // Regroupement par famille, dans l'ordre défini au dashboard.
  const groups = new Map<string, { name: string; services: typeof services }>();
  for (const service of services) {
    const key = service.group?.id ?? "autres";
    const name = service.group?.name ?? "Autres prestations";
    if (!groups.has(key)) groups.set(key, { name, services: [] });
    groups.get(key)!.services.push(service);
  }
  const ordered = [...groups.values()];

  return (
    <>
      <section className="border-b border-line py-14 md:py-16">
        <div className="shell max-w-[720px]">
          <p className="eyebrow">Nos prestations</p>
          <h1 className="mb-4 mt-3 text-[clamp(30px,4vw,44px)] font-bold leading-tight">
            Un soin pour chaque besoin
          </h1>
          <p className="text-[16px] leading-relaxed text-ink-dim">
            Chaque formule détaille précisément ce qui est inclus, son tarif par gabarit
            de véhicule et les options disponibles en supplément. Aucune réservation en
            ligne : contactez-nous pour fixer votre créneau, le paiement se fait à
            l&apos;atelier.
          </p>
        </div>
      </section>

      {ordered.length === 0 && (
        <section className="border-b border-line py-12 md:py-14">
          <div className="shell">
            <ContentUnavailable>
              Nos prestations ne sont pas accessibles pour le moment.
            </ContentUnavailable>
          </div>
        </section>
      )}

      {ordered.map((group) => (
        <section key={group.name} className="border-b border-line py-12 md:py-14">
          <div className="shell">
            <h2 className="mb-7 text-[22px] font-bold">{group.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {group.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-12 md:py-16">
        <div className="shell flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-ink-dim">
            Vous hésitez entre deux formules ? Décrivez-nous l&apos;état de votre véhicule,
            nous vous orientons vers celle qui correspond vraiment à votre besoin.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tarifs" className="btn btn-ghost">
              Grille tarifaire complète
            </Link>
            <Link href="/contact" className="btn btn-primary">
              Demander un conseil
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
