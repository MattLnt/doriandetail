"use server";

import { z } from "zod";

import { sendContactNotification } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getSettingsOrFallback } from "@/lib/queries";

const schema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(120),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z.string().trim().max(40).optional(),
  vehicle: z.string().trim().max(120).optional(),
  serviceSlug: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Détaillez un peu votre demande.").max(4000),
  // Champ leurre : rempli uniquement par les robots.
  company: z.string().max(0).optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "vehicle" | "message", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? undefined,
    vehicle: formData.get("vehicle") ?? undefined,
    serviceSlug: formData.get("serviceSlug") ?? undefined,
    message: formData.get("message") ?? "",
    company: formData.get("company") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        key === "name" ||
        key === "email" ||
        key === "phone" ||
        key === "vehicle" ||
        key === "message"
      ) {
        fieldErrors[key] ??= issue.message;
      }
    }
    // Le leurre est rempli : on répond comme si tout allait bien, sans rien enregistrer.
    if (parsed.error.issues.some((issue) => issue.path[0] === "company")) {
      return { status: "success", message: "Merci, votre demande a bien été envoyée." };
    }
    return {
      status: "error",
      message: "Certains champs doivent être corrigés.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Base injoignable : on continue sans la prestation plutot que de perdre la
  // demande. Le slug brut part dans l'email, Dorian sait de quoi il s'agit.
  let service: {
    id: string;
    name: string;
    options: { option: { id: string; name: string } }[];
  } | null = null;
  try {
    service = data.serviceSlug
      ? await prisma.service.findUnique({
          where: { slug: data.serviceSlug },
          select: {
            id: true,
            name: true,
            options: {
              where: { option: { published: true } },
              select: { option: { select: { id: true, name: true } } },
            },
          },
        })
      : null;
  } catch (error) {
    console.error("[contact] prestation illisible", error);
  }

  // Les cases cochees ne sont pas fiables : le formulaire est modifiable cote
  // client. On ne retient que les options reellement rattachees a la
  // prestation choisie, et on enregistre leur nom, pas l'id recu.
  const requestedIds = new Set(formData.getAll("options").map(String));
  const optionNames = (service?.options ?? [])
    .map((link) => link.option)
    .filter((option) => requestedIds.has(option.id))
    .map((option) => option.name);

  let saved = true;
  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        vehicle: data.vehicle || null,
        message: data.message,
        serviceId: service?.id ?? null,
        optionNames,
      },
    });
  } catch (error) {
    console.error("[contact] enregistrement impossible", error);
    saved = false;
  }

  const settings = await getSettingsOrFallback();
  const notification = await sendContactNotification(
    { ...data, serviceName: service?.name ?? data.serviceSlug ?? null, optionNames },
    settings.email,
  );

  // Les deux canaux sont tombes : la demande n'existe nulle part, il faut le dire.
  if (!saved && !notification.sent) {
    console.error("[contact] demande perdue :", notification.error);
    return {
      status: "error",
      message: `Une erreur est survenue à l'envoi. Réessayez, ou appelez-nous directement au ${settings.phone}.`,
    };
  }
  if (!saved) {
    // Transmise par email seulement : elle n'apparaitra pas dans le dashboard.
    console.warn("[contact] demande transmise par email uniquement, base injoignable");
  }
  if (!notification.sent) {
    // La demande est enregistrée et visible dans le dashboard : on n'alerte pas le visiteur.
    console.warn("[contact] notification email non envoyée :", notification.error);
  }

  return {
    status: "success",
    message:
      "Merci, votre demande est bien arrivée. Nous revenons vers vous rapidement pour fixer un créneau.",
  };
}
