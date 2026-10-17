import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteButton, PageHeader, Panel } from "@/components/admin/ui";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/ServiceForm";
import { centsToInput, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { deleteService, updateService } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditServicePage({ params, searchParams }: PageProps) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);

  const [service, vehicleClasses, options, groups] = await Promise.all([
    prisma.service.findUnique({
      where: { id },
      include: {
        inclusions: { orderBy: { position: "asc" } },
        prices: true,
        options: { select: { optionId: true } },
      },
    }),
    prisma.vehicleClass.findMany({ orderBy: { position: "asc" } }),
    prisma.option.findMany({ orderBy: { position: "asc" } }),
    prisma.serviceGroup.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!service) notFound();

  const prices: ServiceFormValues["prices"] = {};
  for (const price of service.prices) {
    prices[price.vehicleClassId] = {
      price: centsToInput(price.priceCents),
      promo: centsToInput(price.promoCents),
    };
  }

  const values: ServiceFormValues = {
    name: service.name,
    slug: service.slug,
    groupId: service.groupId,
    icon: service.icon,
    tagline: service.tagline,
    description: service.description,
    badge: service.badge,
    position: service.position,
    published: service.published,
    featured: service.featured,
    quoteOnly: service.quoteOnly,
    inclusionsText: service.inclusions.map((i) => i.label).join("\n"),
    prices,
    selectedOptionIds: service.options.map((o) => o.optionId),
  };

  const updateAction = updateService.bind(null, service.id);

  return (
    <>
      <PageHeader title={service.name} description={`Fiche publique : /prestations/${service.slug}`} />

      {created && (
        <p
          role="status"
          className="mb-5 rounded-[10px] border border-[rgba(45,122,78,0.3)] bg-[rgba(45,122,78,0.08)] px-4 py-3 text-[13.5px] text-[#2d7a4e]"
        >
          Prestation créée. Vous pouvez poursuivre son édition ci-dessous.
        </p>
      )}

      <div className="mb-5 flex flex-wrap gap-3">
        <Link
          href={`/prestations/${service.slug}`}
          target="_blank"
          className="btn btn-ghost btn-sm"
        >
          Voir la fiche sur le site ↗
        </Link>
      </div>

      <ServiceForm
        action={updateAction}
        values={values}
        vehicleClasses={vehicleClasses}
        groups={groups}
        options={options.map((option) => ({
          id: option.id,
          name: option.name,
          priceLabel: formatPrice(option.priceCents),
        }))}
        submitLabel="Enregistrer les modifications"
      />

      <div className="mt-6">
        <Panel
          title="Supprimer cette prestation"
          description="La suppression est définitive : inclusions, tarifs et liens vers les options sont retirés. Pour la masquer temporairement, décochez « Visible sur le site »."
        >
          <form action={deleteService}>
            <input type="hidden" name="id" value={service.id} />
            <DeleteButton
              label="Supprimer définitivement"
              confirmMessage={`Supprimer définitivement la prestation « ${service.name} » ? Cette action est irréversible.`}
            />
          </form>
        </Panel>
      </div>
    </>
  );
}
