import { prisma } from "@/lib/prisma";

/** Réglages du site, en créant la ligne unique au premier appel. */
export async function getSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  return prisma.siteSettings.create({ data: { id: "singleton" } });
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getVehicleClasses() {
  return prisma.vehicleClass.findMany({ orderBy: { position: "asc" } });
}

export type VehicleClass = Awaited<ReturnType<typeof getVehicleClasses>>[number];

const servicePublicInclude = {
  group: true,
  inclusions: { orderBy: { position: "asc" } },
  prices: { include: { vehicleClass: true } },
  options: { include: { option: true } },
} as const;

/** Prestations publiées, avec prix, inclusions et options. */
export async function getPublishedServices() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: servicePublicInclude,
  });
  return services.map(sortServiceRelations);
}

export async function getServiceBySlug(slug: string) {
  const service = await prisma.service.findFirst({
    where: { slug, published: true },
    include: servicePublicInclude,
  });
  return service ? sortServiceRelations(service) : null;
}

export type PublicService = Awaited<ReturnType<typeof getPublishedServices>>[number];

/**
 * Trie les relations selon l'ordre défini dans le dashboard. Prisma ne permet pas
 * d'ordonner une relation imbriquée sur le champ d'une autre table, d'où ce tri local.
 */
function sortServiceRelations<
  T extends {
    prices: { vehicleClass: { position: number } }[];
    options: { option: { position: number } }[];
  },
>(service: T): T {
  return {
    ...service,
    prices: [...service.prices].sort(
      (a, b) => a.vehicleClass.position - b.vehicleClass.position,
    ),
    options: [...service.options].sort((a, b) => a.option.position - b.option.position),
  };
}

/** Prix d'appel d'une prestation : le plus bas parmi tous les gabarits. */
export function startingPrice(service: {
  quoteOnly: boolean;
  prices: { priceCents: number | null; promoCents: number | null }[];
}): number | null {
  if (service.quoteOnly) return null;
  const amounts = service.prices
    .map((p) => p.promoCents ?? p.priceCents)
    .filter((value): value is number => value !== null);
  if (amounts.length === 0) return null;
  return Math.min(...amounts);
}

export async function getPublishedOptions() {
  return prisma.option.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
  });
}

/** Rayons de la boutique contenant au moins un produit publié. */
export async function getShopData() {
  const [categories, products] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { position: "asc" } }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      include: { category: true },
    }),
  ]);

  const usedCategoryIds = new Set(products.map((p) => p.categoryId).filter(Boolean));
  return {
    categories: categories.filter((c) => usedCategoryIds.has(c.id)),
    products,
  };
}

export type PublicProduct = Awaited<ReturnType<typeof getShopData>>["products"][number];
