"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { describeError, requireAdmin, type ActionState } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .refine(
    (value) => !value || /^https?:\/\//i.test(value),
    "L'adresse doit commencer par http:// ou https://",
  );

const schema = z.object({
  phone: z.string().trim().min(4, "Indiquez un téléphone.").max(40),
  email: z.string().trim().email("Adresse email invalide."),
  addressLine: z.string().trim().min(2).max(160),
  city: z.string().trim().min(2).max(120),
  hours: z.string().trim().max(500),
  instagram: optionalUrl,
  facebook: optionalUrl,
  tiktok: optionalUrl,
  googleUrl: optionalUrl,
  googleReviewsUrl: optionalUrl,
  googleRating: z.string().trim().max(10),
  googleReviewCount: z.coerce
    .number()
    .int()
    .min(0, "Le nombre d'avis ne peut pas être négatif.")
    .max(100000),
  heroTitle: z.string().trim().min(5, "Le titre est trop court.").max(200),
  heroText: z.string().trim().min(10).max(800),
  statVehicles: z.string().trim().max(20),
  statRating: z.string().trim().max(20),
  boutiqueNote: z.string().trim().max(600),
});

export async function updateSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    addressLine: formData.get("addressLine") ?? "",
    city: formData.get("city") ?? "",
    hours: formData.get("hours") ?? "",
    instagram: formData.get("instagram") ?? undefined,
    facebook: formData.get("facebook") ?? undefined,
    tiktok: formData.get("tiktok") ?? undefined,
    googleUrl: formData.get("googleUrl") ?? undefined,
    googleReviewsUrl: formData.get("googleReviewsUrl") ?? undefined,
    googleRating: formData.get("googleRating") ?? "",
    googleReviewCount: formData.get("googleReviewCount") ?? 0,
    heroTitle: formData.get("heroTitle") ?? "",
    heroText: formData.get("heroText") ?? "",
    statVehicles: formData.get("statVehicles") ?? "",
    statRating: formData.get("statRating") ?? "",
    boutiqueNote: formData.get("boutiqueNote") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const data = {
    ...parsed.data,
    instagram: parsed.data.instagram || null,
    facebook: parsed.data.facebook || null,
    tiktok: parsed.data.tiktok || null,
    googleUrl: parsed.data.googleUrl || null,
    googleReviewsUrl: parsed.data.googleReviewsUrl || null,
  };

  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
  } catch (error) {
    return { status: "error", message: describeError(error, "updateSettings") };
  }

  // Les réglages alimentent l'en-tête, le pied de page et plusieurs pages.
  revalidatePath("/", "layout");

  return { status: "success", message: "Réglages enregistrés." };
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Saisissez votre mot de passe actuel."),
    next: z
      .string()
      .min(10, "Le nouveau mot de passe doit faire au moins 10 caractères.")
      .max(200),
    confirm: z.string(),
  })
  .refine((data) => data.next === data.confirm, {
    message: "Les deux nouveaux mots de passe ne correspondent pas.",
  });

export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();

  const parsed = passwordSchema.safeParse({
    current: formData.get("current") ?? "",
    next: formData.get("next") ?? "",
    confirm: formData.get("confirm") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const record = await prisma.admin.findUnique({
    where: { id: admin.id },
    select: { passwordHash: true },
  });
  if (!record) return { status: "error", message: "Compte introuvable." };

  const ok = await bcrypt.compare(parsed.data.current, record.passwordHash);
  if (!ok) return { status: "error", message: "Mot de passe actuel incorrect." };

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 10) },
  });

  return { status: "success", message: "Mot de passe mis à jour." };
}
