import { PageHeader } from "@/components/admin/ui";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/ServiceForm";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { createService } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nouvelle prestation" };

export default async function NewServicePage() {
  const [vehicleClasses, options, groups, count] = await Promise.all([
    prisma.vehicleClass.findMany({ orderBy: { position: "asc" } }),
    prisma.option.findMany({ orderBy: { position: "asc" } }),
    prisma.serviceGroup.findMany({ orderBy: { position: "asc" } }),
    prisma.service.count(),
  ]);

  const values: ServiceFormValues = {
    name: "",
    slug: "",
    groupId: null,
    icon: "sparkle",
    tagline: null,
    description: null,
    badge: null,
    position: count,
    published: true,
    featured: false,
    quoteOnly: false,
    inclusionsText: "",
    prices: {},
    selectedOptionIds: [],
  };

  return (
    <>
      <PageHeader
        title="Nouvelle prestation"
        description="Renseignez la présentation, le contenu de la prestation et ses tarifs par gabarit."
      />
      <ServiceForm
        action={createService}
        values={values}
        vehicleClasses={vehicleClasses}
        groups={groups}
        options={options.map((option) => ({
          id: option.id,
          name: option.name,
          priceLabel: formatPrice(option.priceCents),
        }))}
        submitLabel="Créer la prestation"
      />
    </>
  );
}
