"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { parsePriceToCents, slugify } from "@/lib/format";
import { describeError, requireAdmin, type ActionState } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "Le nom est obligatoire.").max(160),
  slug: z.string().trim().max(80).optional(),
  groupId: z.string().trim().optional(),
  icon: z.string().trim().min(1).max(40),
  tagline: z.string().trim().max(2000).optional(),
  description: z.string().trim().max(2000).optional(),
  badge: z.string().trim().max(60).optional(),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean(),
  featured: z.boolean(),
  quoteOnly: z.boolean(),
  inclusions: z.string().max(8000).optional(),
});

function readForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name") ?? "",
    slug: formData.get("slug") ?? undefined,
    groupId: formData.get("groupId") ?? undefined,
    icon: formData.get("icon") ?? "sparkle",
    tagline: formData.get("tagline") ?? undefined,
    description: formData.get("description") ?? undefined,
    badge: formData.get("badge") ?? undefined,
    position: formData.get("position") ?? 0,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    quoteOnly: formData.get("quoteOnly") === "on",
    inclusions: formData.get("inclusions") ?? undefined,
  });
}

/** Une ligne de textarea = une inclusion. Les lignes vides et puces sont nettoyées. */
function parseInclusions(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 200);
}

/** Prix et promos envoyés sous la forme price_<vehicleClassId> / promo_<id>. */
async function savePrices(serviceId: string, formData: FormData) {
  const vehicleClasses = await prisma.vehicleClass.findMany({ select: { id: true } });
  for (const vc of vehicleClasses) {
    const priceCents = parsePriceToCents(formData.get(`price_${vc.id}`)?.toString());
    const promoCents = parsePriceToCents(formData.get(`promo_${vc.id}`)?.toString());
    await prisma.servicePrice.upsert({
      where: { serviceId_vehicleClassId: { serviceId, vehicleClassId: vc.id } },
      update: { priceCents, promoCents },
      create: { serviceId, vehicleClassId: vc.id, priceCents, promoCents },
    });
  }
}

async function saveOptions(serviceId: string, formData: FormData) {
  const selected = formData.getAll("options").map(String).filter(Boolean);
  await prisma.serviceOption.deleteMany({ where: { serviceId } });
  if (selected.length === 0) return;
  // On ne garde que des options réellement existantes.
  const valid = await prisma.option.findMany({
    where: { id: { in: selected } },
    select: { id: true },
  });
  if (valid.length === 0) return;
  await prisma.serviceOption.createMany({
    data: valid.map((option) => ({ serviceId, optionId: option.id })),
  });
}

async function saveInclusions(serviceId: string, labels: string[]) {
  await prisma.serviceInclusion.deleteMany({ where: { serviceId } });
  if (labels.length === 0) return;
  await prisma.serviceInclusion.createMany({
    data: labels.map((label, position) => ({ serviceId, label, position })),
  });
}

function revalidateService(slug?: string) {
  revalidatePath("/");
  revalidatePath("/prestations");
  revalidatePath("/tarifs");
  revalidatePath("/contact");
  if (slug) revalidatePath(`/prestations/${slug}`);
}

export async function createService(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const data = parsed.data;
  const slug = slugify(data.slug || data.name);
  if (!slug) return { status: "error", message: "Impossible de générer un identifiant." };

  let id: string;
  try {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug,
        groupId: data.groupId || null,
        icon: data.icon,
        tagline: data.tagline || null,
        description: data.description || null,
        badge: data.badge || null,
        position: data.position,
        published: data.published,
        featured: data.featured,
        quoteOnly: data.quoteOnly,
      },
    });
    id = service.id;
    await saveInclusions(id, parseInclusions(data.inclusions));
    await savePrices(id, formData);
    await saveOptions(id, formData);
  } catch (error) {
    return { status: "error", message: describeError(error, "createService") };
  }

  revalidateService(slug);
  redirect(`/admin/prestations/${id}?created=1`);
}

export async function updateService(
  serviceId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const data = parsed.data;
  const slug = slugify(data.slug || data.name);
  if (!slug) return { status: "error", message: "Impossible de générer un identifiant." };

  const previous = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { slug: true },
  });

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: data.name,
        slug,
        groupId: data.groupId || null,
        icon: data.icon,
        tagline: data.tagline || null,
        description: data.description || null,
        badge: data.badge || null,
        position: data.position,
        published: data.published,
        featured: data.featured,
        quoteOnly: data.quoteOnly,
      },
    });
    await saveInclusions(serviceId, parseInclusions(data.inclusions));
    await savePrices(serviceId, formData);
    await saveOptions(serviceId, formData);
  } catch (error) {
    return { status: "error", message: describeError(error, "updateService") };
  }

  revalidateService(slug);
  if (previous && previous.slug !== slug) revalidateService(previous.slug);
  revalidatePath(`/admin/prestations/${serviceId}`);

  return { status: "success", message: "Prestation enregistrée." };
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const service = await prisma.service.findUnique({
    where: { id },
    select: { slug: true },
  });
  await prisma.service.delete({ where: { id } });

  revalidateService(service?.slug);
  revalidatePath("/admin/prestations");
  redirect("/admin/prestations");
}

/** Bascule rapide publié / brouillon depuis la liste. */
export async function toggleServicePublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const service = await prisma.service.findUnique({
    where: { id },
    select: { published: true, slug: true },
  });
  if (!service) return;

  await prisma.service.update({
    where: { id },
    data: { published: !service.published },
  });

  revalidateService(service.slug);
  revalidatePath("/admin/prestations");
}
