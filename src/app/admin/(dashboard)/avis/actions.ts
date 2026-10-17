"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { describeError, requireAdmin, type ActionState } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  author: z.string().trim().min(2, "Indiquez l'auteur.").max(120),
  location: z.string().trim().max(120).optional(),
  content: z.string().trim().min(10, "L'avis est trop court.").max(1200),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean(),
});

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/avis");
}

export async function createTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    author: formData.get("author") ?? "",
    location: formData.get("location") ?? undefined,
    content: formData.get("content") ?? "",
    rating: formData.get("rating") ?? 5,
    position: formData.get("position") ?? 0,
    published: formData.get("published") !== null,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  try {
    await prisma.testimonial.create({
      data: {
        author: parsed.data.author,
        location: parsed.data.location || null,
        content: parsed.data.content,
        rating: parsed.data.rating,
        position: parsed.data.position,
        published: parsed.data.published,
      },
    });
  } catch (error) {
    return { status: "error", message: describeError(error, "createTestimonial") };
  }

  revalidateTestimonials();
  return { status: "success", message: "Avis ajouté." };
}

export async function updateTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const parsed = schema.safeParse({
    author: formData.get("author") ?? "",
    location: formData.get("location") ?? undefined,
    content: formData.get("content") ?? "",
    rating: formData.get("rating") ?? 5,
    position: formData.get("position") ?? 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return;

  await prisma.testimonial.update({
    where: { id },
    data: {
      author: parsed.data.author,
      location: parsed.data.location || null,
      content: parsed.data.content,
      rating: parsed.data.rating,
      position: parsed.data.position,
      published: parsed.data.published,
    },
  });
  revalidateTestimonials();
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await prisma.testimonial.delete({ where: { id } });
  revalidateTestimonials();
}
