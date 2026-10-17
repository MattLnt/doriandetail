"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { slugify } from "@/lib/format";
import { describeError, requireAdmin, type ActionState } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "Le nom est obligatoire.").max(120),
  position: z.coerce.number().int().min(0).max(999).default(0),
});

function revalidateCategories() {
  revalidatePath("/boutique");
  revalidatePath("/admin/rayons");
  revalidatePath("/admin/produits");
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    position: formData.get("position") ?? 0,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const base = slugify(parsed.data.name) || "rayon";
  let slug = base;
  for (let attempt = 2; attempt < 40; attempt += 1) {
    const taken = await prisma.productCategory.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!taken) break;
    slug = `${base}-${attempt}`;
  }

  try {
    await prisma.productCategory.create({
      data: { name: parsed.data.name, slug, position: parsed.data.position },
    });
  } catch (error) {
    return { status: "error", message: describeError(error, "createCategory") };
  }

  revalidateCategories();
  return { status: "success", message: "Rayon ajouté." };
}

export async function updateCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    position: formData.get("position") ?? 0,
  });
  if (!parsed.success) return;

  await prisma.productCategory.update({
    where: { id },
    data: { name: parsed.data.name, position: parsed.data.position },
  });
  revalidateCategories();
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  // Les produits du rayon sont conservés : leur categoryId passe à null (SetNull).
  await prisma.productCategory.delete({ where: { id } });
  revalidateCategories();
}
