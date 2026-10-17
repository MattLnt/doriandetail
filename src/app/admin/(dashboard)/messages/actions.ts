"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

/** Marque une demande comme traitée, ou la rouvre. */
export async function toggleHandled(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
    select: { handled: true },
  });
  if (!message) return;

  await prisma.contactMessage.update({
    where: { id },
    data: { handled: !message.handled },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
