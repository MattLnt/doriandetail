import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  OPTIONS,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  SERVICES,
  SERVICE_GROUPS,
  VEHICLE_CLASSES,
} from "./seed-data";

const prisma = new PrismaClient();

const toCents = (euros: number) => Math.round(euros * 100);

async function main() {
  console.log("→ Gabarits de véhicule");
  const vehicleIds = new Map<string, string>();
  for (const [index, vc] of VEHICLE_CLASSES.entries()) {
    const row = await prisma.vehicleClass.upsert({
      where: { slug: vc.slug },
      update: { name: vc.name, position: index },
      create: { name: vc.name, slug: vc.slug, position: index },
    });
    vehicleIds.set(vc.slug, row.id);
  }

  console.log("→ Options");
  const optionIds = new Map<string, string>();
  for (const [index, opt] of OPTIONS.entries()) {
    const row = await prisma.option.upsert({
      where: { slug: opt.slug },
      update: {
        name: opt.name,
        description: opt.description,
        priceCents: toCents(opt.price),
        position: index,
      },
      create: {
        name: opt.name,
        slug: opt.slug,
        description: opt.description,
        priceCents: toCents(opt.price),
        position: index,
      },
    });
    optionIds.set(opt.slug, row.id);
  }

  console.log("→ Familles de prestations");
  const groupIds = new Map<string, string>();
  for (const [index, group] of SERVICE_GROUPS.entries()) {
    const row = await prisma.serviceGroup.upsert({
      where: { slug: group.slug },
      update: { name: group.name, position: index },
      create: { name: group.name, slug: group.slug, position: index },
    });
    groupIds.set(group.slug, row.id);
  }

  console.log("→ Prestations");
  for (const [index, service] of SERVICES.entries()) {
    const row = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        tagline: service.tagline,
        description: service.description ?? null,
        icon: service.icon,
        badge: service.badge ?? null,
        featured: service.featured ?? false,
        quoteOnly: service.quoteOnly ?? false,
        position: index,
        groupId: groupIds.get(service.group) ?? null,
      },
      create: {
        name: service.name,
        slug: service.slug,
        tagline: service.tagline,
        description: service.description ?? null,
        icon: service.icon,
        badge: service.badge ?? null,
        featured: service.featured ?? false,
        quoteOnly: service.quoteOnly ?? false,
        position: index,
        groupId: groupIds.get(service.group) ?? null,
      },
    });

    // Les inclusions sont une liste ordonnée : on la réécrit entièrement.
    await prisma.serviceInclusion.deleteMany({ where: { serviceId: row.id } });
    await prisma.serviceInclusion.createMany({
      data: service.inclusions.map((label, position) => ({
        serviceId: row.id,
        label,
        position,
      })),
    });

    for (const vc of VEHICLE_CLASSES) {
      const vehicleClassId = vehicleIds.get(vc.slug)!;
      const euros = service.prices[vc.slug];
      const promo = service.promos?.[vc.slug];
      const priceCents = euros === null ? null : toCents(euros);
      const promoCents = promo === undefined ? null : toCents(promo);
      await prisma.servicePrice.upsert({
        where: { serviceId_vehicleClassId: { serviceId: row.id, vehicleClassId } },
        update: { priceCents, promoCents },
        create: { serviceId: row.id, vehicleClassId, priceCents, promoCents },
      });
    }

    await prisma.serviceOption.deleteMany({ where: { serviceId: row.id } });
    if (service.options.length > 0) {
      await prisma.serviceOption.createMany({
        data: service.options.map((slug) => ({
          serviceId: row.id,
          optionId: optionIds.get(slug)!,
        })),
      });
    }
  }

  console.log("→ Rayons boutique");
  const categoryIds = new Map<string, string>();
  for (const [index, cat] of PRODUCT_CATEGORIES.entries()) {
    const row = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, position: index },
      create: { name: cat.name, slug: cat.slug, position: index },
    });
    categoryIds.set(cat.slug, row.id);
  }

  console.log("→ Produits");
  for (const [index, product] of PRODUCTS.entries()) {
    const data = {
      name: product.name,
      description: product.description,
      format: product.format,
      priceCents: toCents(product.price),
      featured: product.featured,
      position: index,
      categoryId: categoryIds.get(product.category) ?? null,
    };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { ...data, slug: product.slug },
    });
  }

  console.log("→ Réglages du site");
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  console.log("→ Compte administrateur");
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      "  ADMIN_EMAIL / ADMIN_PASSWORD absents du .env — aucun compte admin créé.",
    );
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash, name: "Dorian" },
    });
    console.log(`  Compte prêt : ${email}`);
  }

  console.log("\nSeed terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
