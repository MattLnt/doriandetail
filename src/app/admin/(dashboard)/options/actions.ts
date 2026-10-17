"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parsePriceToCents, slugify } from "@/lib/format";
import { describeError, requireAdmin, type ActionState } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "Le nom est obligatoire.").max(200),
  description: z.string().trim().max(600).optional(),
  price: z.string().trim().min(1, "Indiquez un prix."),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean(),
});

function revalidateOptions() {
  revalidatePath("/tarifs");
  revalidatePath("/prestations");
  revalidatePath("/admin/options");
}

export async function createOption(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? undefined,
    price: formData.get("price") ?? "",
    position: formData.get("position") ?? 0,
    published: formData.get("published") !== null,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const priceCents = parsePriceToCents(parsed.data.price);
  if (priceCents === null) {
    return { status: "error", message: "Prix invalide. Exemple : 80" };
  }

  // Slug dérivé du nom, suffixé si déjà pris.
  const base = slugify(parsed.data.name) || "option";
  let slug = base;
  for (let attempt = 2; attempt < 40; attempt += 1) {
    const taken = await prisma.option.findUnique({ where: { slug }, select: { id: true } });
    if (!taken) break;
    slug = `${base}-${attempt}`;
  }

  try {
    await prisma.option.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        priceCents,
        position: parsed.data.position,
        published: parsed.data.published,
      },
    });
  } catch (error) {
    return { status: "error", message: describeError(error, "createOption") };
  }

  revalidateOptions();
  return { status: "success", message: "Option ajoutée." };
}

export async function updateOption(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? undefined,
    price: formData.get("price") ?? "",
    position: formData.get("position") ?? 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return;

  const priceCents = parsePriceToCents(parsed.data.price);
  if (priceCents === null) return;

  await prisma.option.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      priceCents,
      position: parsed.data.position,
      published: parsed.data.published,
    },
  });

  revalidateOptions();
}

export async function deleteOption(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  // Les liaisons ServiceOption disparaissent en cascade.
  await prisma.option.delete({ where: { id } });
  revalidateOptions();
}
