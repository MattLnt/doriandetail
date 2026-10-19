import Link from "next/link";

import { DeleteButton, EmptyState, PageHeader, SubmitButton } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { deleteMessage, toggleHandled } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Demandes" };

type PageProps = { searchParams: Promise<{ filtre?: string }> };

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const { filtre } = await searchParams;
  const showHandled = filtre === "traitees";

  const messages = await prisma.contactMessage.findMany({
    where: showHandled ? {} : { handled: false },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { service: { select: { name: true } } },
  });

  return (
    <>
      <PageHeader
        title="Demandes de contact"
        description="Les demandes envoyées depuis le site. Elles sont aussi transmises par email, mais restent consultables ici même en cas d'échec d'envoi."
      />

      <div className="mb-5 flex gap-2.5">
        <FilterLink href="/admin/messages" label="À traiter" active={!showHandled} />
        <FilterLink
          href="/admin/messages?filtre=traitees"
          label="Toutes"
          active={showHandled}
        />
      </div>

      {messages.length === 0 ? (
        <EmptyState
          title={showHandled ? "Aucune demande" : "Aucune demande en attente"}
          description={
            showHandled
              ? "Les demandes envoyées depuis le formulaire de contact apparaîtront ici."
              : "Tout est à jour. Les demandes déjà traitées restent accessibles via « Toutes »."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-[16px] border bg-bg p-6 ${
                message.handled ? "border-line" : "border-accent/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-[16px] font-bold">{message.name}</h2>
                  <p className="mt-1 text-[13px] text-ink-dim">
                    <a href={`mailto:${message.email}`} className="hover:text-accent-deep">
                      {message.email}
                    </a>
                    {message.phone && (
                      <>
                        {" · "}
                        <a
                          href={`tel:${message.phone.replace(/[^0-9+]/g, "")}`}
                          className="hover:text-accent-deep"
                        >
                          {message.phone}
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`badge ${message.handled ? "badge-off" : "badge-accent"}`}>
                    {message.handled ? "Traitée" : "À traiter"}
                  </span>
                  <p className="mt-1.5 text-[12px] text-ink-faint">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
                {message.vehicle && (
                  <div>
                    <dt className="text-ink-faint">Véhicule</dt>
                    <dd className="font-semibold">{message.vehicle}</dd>
                  </div>
                )}
                {message.service && (
                  <div>
                    <dt className="text-ink-faint">Prestation</dt>
                    <dd className="font-semibold">{message.service.name}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-4 whitespace-pre-wrap rounded-[10px] border border-line bg-surface p-4 text-[13.5px] leading-relaxed text-ink-dim">
                {message.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    "Votre demande — Dorian Detailing",
                  )}`}
                  className="btn btn-primary btn-sm"
                >
                  Répondre par email
                </a>
                <form action={toggleHandled} className="inline">
                  <input type="hidden" name="id" value={message.id} />
                  <SubmitButton
                    label={message.handled ? "Rouvrir" : "Marquer comme traitée"}
                    pendingLabel="…"
                    className="btn btn-ghost btn-sm"
                  />
                </form>
                <form action={deleteMessage} className="ml-auto inline">
                  <input type="hidden" name="id" value={message.id} />
                  <DeleteButton
                    confirmMessage={`Supprimer définitivement la demande de ${message.name} ?`}
                  />
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
        active
          ? "admin-gradient-active border-accent/40 text-ink"
          : "border-line bg-bg text-ink-dim hover:border-accent/50"
      }`}
    >
      {label}
    </Link>
  );
}
