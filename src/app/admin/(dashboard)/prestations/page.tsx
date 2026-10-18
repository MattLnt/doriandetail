import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/admin/ui";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { toggleServicePublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: {
      group: { select: { name: true } },
      prices: { select: { priceCents: true, promoCents: true } },
      _count: { select: { inclusions: true, options: true } },
    },
  });

  return (
    <>
      <PageHeader
        title="Prestations"
        description="Chaque prestation porte sa description, sa liste d'inclusions, un tarif par gabarit de véhicule et les options proposées en supplément."
        action={{ href: "/admin/prestations/nouvelle", label: "Nouvelle prestation" }}
      />

      {services.length === 0 ? (
        <EmptyState
          title="Aucune prestation"
          description="Créez votre première prestation pour l'afficher sur le site."
          action={{ href: "/admin/prestations/nouvelle", label: "Nouvelle prestation" }}
        />
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-line bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface">
                <Th>Prestation</Th>
                <Th className="hidden md:table-cell">Famille</Th>
                <Th className="hidden lg:table-cell">Contenu</Th>
                <Th>Dès</Th>
                <Th>État</Th>
                <Th>
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const amounts = service.prices
                  .map((p) => p.promoCents ?? p.priceCents)
                  .filter((value): value is number => value !== null);
                const from = amounts.length > 0 ? Math.min(...amounts) : null;

                return (
                  <tr key={service.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/prestations/${service.id}`}
                        className="text-[14px] font-semibold hover:text-accent-deep"
                      >
                        {service.name}
                      </Link>
                      <span className="mt-0.5 block text-[12px] text-ink-faint">
                        /{service.slug}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-[13px] text-ink-dim md:table-cell">
                      {service.group?.name ?? "—"}
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-dim lg:table-cell">
                      {service._count.inclusions} inclus · {service._count.options} options
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[13.5px] font-semibold">
                      {service.quoteOnly || from === null ? "Sur devis" : formatPrice(from)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`badge ${service.published ? "badge-on" : "badge-off"}`}
                      >
                        {service.published ? "En ligne" : "Brouillon"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <form action={toggleServicePublished} className="inline">
                        <input type="hidden" name="id" value={service.id} />
                        <PublishToggle published={service.published} />
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint ${className}`}
    >
      {children}
    </th>
  );
}
