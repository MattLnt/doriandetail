import Link from "next/link";

import { EmptyState, Panel } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [
    servicesTotal,
    servicesPublished,
    productsTotal,
    productsPublished,
    optionsTotal,
    pending,
    recent,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { published: true } }),
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.option.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { service: { select: { name: true } } },
    }),
  ]);

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[26px] font-bold">Vue d&apos;ensemble</h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-dim">
          Gérez vos prestations, leurs tarifs et les produits de la boutique. Le site est
          une vitrine : aucune réservation ni paiement en ligne, les clients vous
          contactent et règlent à l&apos;atelier.
        </p>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Prestations en ligne"
          value={`${servicesPublished} / ${servicesTotal}`}
          href="/admin/prestations"
        />
        <Stat
          label="Produits en ligne"
          value={`${productsPublished} / ${productsTotal}`}
          href="/admin/produits"
        />
        <Stat label="Options actives" value={String(optionsTotal)} href="/admin/options" />
        <Stat
          label="Demandes à traiter"
          value={String(pending)}
          href="/admin/messages"
          highlight={pending > 0}
        />
      </div>

      <Panel
        title="Dernières demandes"
        description="Les cinq demandes les plus récentes envoyées depuis le site."
      >
        {recent.length === 0 ? (
          <EmptyState
            title="Aucune demande pour l'instant"
            description="Les messages envoyés depuis le formulaire de contact s'afficheront ici."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-[rgba(20,20,19,0.08)]">
            {recent.map((message) => (
              <li key={message.id} className="flex flex-wrap items-center gap-3 py-3.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold">{message.name}</span>
                  <span className="block truncate text-[13px] text-ink-faint">
                    {message.service?.name ?? "Demande générale"} ·{" "}
                    {formatDate(message.createdAt)}
                  </span>
                </span>
                <span className={`badge ${message.handled ? "badge-off" : "badge-accent"}`}>
                  {message.handled ? "Traitée" : "À traiter"}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <Link href="/admin/messages" className="btn btn-ghost btn-sm">
            Voir toutes les demandes
          </Link>
        </div>
      </Panel>
    </>
  );
}

function Stat({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`admin-gradient-card rounded-[16px] border p-5 transition-colors hover:border-accent/50 ${
        highlight ? "border-accent/50" : "border-line"
      }`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className="disp mt-2 text-[28px] font-bold text-accent">{value}</p>
    </Link>
  );
}
