import { prisma } from "@/lib/prisma";
import { FALLBACK_SETTINGS } from "@/lib/site-defaults";

/**
 * Enveloppe une lecture publique. Une base injoignable ne doit casser ni la page
 * ni le build : `next build` prerend l'accueil, les prestations, les tarifs et la
 * boutique, donc une Postgres absente faisait echouer le deploiement entier.
 * On sert un contenu vide, la page garde ses textes et ses liens de contact.
 */
async function orFallback<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[${label}] base injoignable, contenu indisponible`, error);
    return fallback;
  }
}

/** Réglages du site, en créant la ligne unique au premier appel. */
export async function getSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  return prisma.siteSettings.create({ data: { id: "singleton" } });
}

/**
 * Même chose, mais ne jette jamais : en cas de base injoignable on sert les
 * valeurs par défaut plutôt qu'une 500. Réservé aux pages publiques — le
 * dashboard doit au contraire échouer franchement, sans quoi un enregistrement
 * des réglages écraserait les vraies valeurs par ce repli.
 */
export async function getSettingsOrFallback(): Promise<Settings> {
  try {
    return await getSettings();
  } catch (error) {
    console.error("[settings] base injoignable, repli sur les valeurs par défaut", error);
    return FALLBACK_SETTINGS;
  }
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

/* ── Variantes tolerantes, pour les pages publiques uniquement ──────────────
   Le dashboard continue d'appeler les fonctions strictes : un ecran d'admin qui
   affiche une liste vide au lieu d'une erreur ferait croire a une suppression. */

export function getPublishedServicesOrEmpty() {
  return orFallback<PublicService[]>("prestations", getPublishedServices, []);
}

export function getVehicleClassesOrEmpty() {
  return orFallback<VehicleClass[]>("gabarits", getVehicleClasses, []);
}

export function getPublishedOptionsOrEmpty() {
  return orFallback<Awaited<ReturnType<typeof getPublishedOptions>>>(
    "options",
    getPublishedOptions,
    [],
  );
}

export function getShopDataOrEmpty() {
  return orFallback<Awaited<ReturnType<typeof getShopData>>>("boutique", getShopData, {
    categories: [],
    products: [],
  });
}
