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
  categoryId: z.string().trim().optional(),
  description: z.string().trim().max(1000).optional(),
  format: z.string().trim().max(60).optional(),
  brand: z.string().trim().max(80).optional(),
  price: z.string().trim().min(1, "Indiquez un prix."),
  imageUrl: z.string().trim().max(500).optional(),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean(),
  featured: z.boolean(),
});

function readForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name") ?? "",
    slug: formData.get("slug") ?? undefined,
    categoryId: formData.get("categoryId") ?? undefined,
    description: formData.get("description") ?? undefined,
    format: formData.get("format") ?? undefined,
    brand: formData.get("brand") ?? undefined,
    price: formData.get("price") ?? "",
    imageUrl: formData.get("imageUrl") ?? undefined,
    position: formData.get("position") ?? 0,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  });
}

function revalidateShop() {
  revalidatePath("/boutique");
  revalidatePath("/admin/produits");
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const data = parsed.data;

  const priceCents = parsePriceToCents(data.price);
  if (priceCents === null) {
    return { status: "error", message: "Prix invalide. Exemple : 17,90" };
  }

  const slug = slugify(data.slug || data.name);
  if (!slug) return { status: "error", message: "Impossible de générer un identifiant." };

  let id: string;
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId || null,
        description: data.description || null,
        format: data.format || null,
        brand: data.brand || null,
        imageUrl: data.imageUrl || null,
        priceCents,
        position: data.position,
        published: data.published,
        featured: data.featured,
      },
    });
    id = product.id;
  } catch (error) {
    return { status: "error", message: describeError(error, "createProduct") };
  }

  revalidateShop();
  redirect(`/admin/produits/${id}?created=1`);
}

export async function updateProduct(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const data = parsed.data;

  const priceCents = parsePriceToCents(data.price);
  if (priceCents === null) {
    return { status: "error", message: "Prix invalide. Exemple : 17,90" };
  }

  const slug = slugify(data.slug || data.name);
  if (!slug) return { status: "error", message: "Impossible de générer un identifiant." };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId || null,
        description: data.description || null,
        format: data.format || null,
        brand: data.brand || null,
        imageUrl: data.imageUrl || null,
        priceCents,
        position: data.position,
        published: data.published,
        featured: data.featured,
      },
    });
  } catch (error) {
    return { status: "error", message: describeError(error, "updateProduct") };
  }

  revalidateShop();
  revalidatePath(`/admin/produits/${productId}`);
  return { status: "success", message: "Produit enregistré." };
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await prisma.product.delete({ where: { id } });
  revalidateShop();
  redirect("/admin/produits");
}

export async function toggleProductPublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { published: true },
  });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { published: !product.published },
  });
  revalidateShop();
}
