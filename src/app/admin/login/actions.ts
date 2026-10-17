"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { createSessionCookie, destroySessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Email ou mot de passe invalide." };
  }

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email } });
  // Comparaison même sans compte trouvé, pour ne pas révéler l'existence de l'email.
  const hash = admin?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
  const ok = await bcrypt.compare(parsed.data.password, hash);

  if (!admin || !ok) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSessionCookie({ sub: admin.id, email: admin.email });

  const target = parsed.data.next;
  redirect(target && target.startsWith("/admin") ? target : "/admin");
}

export async function logout(): Promise<void> {
  await destroySessionCookie();
  redirect("/admin/login");
}
