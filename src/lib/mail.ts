import "server-only";

import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string | null;
  vehicle?: string | null;
  message: string;
  serviceName?: string | null;
  optionNames?: string[];
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Notifie l'atelier d'une nouvelle demande.
 * L'email est best-effort : la demande est déjà enregistrée en base, donc un échec
 * d'envoi n'invalide pas le formulaire — il est seulement journalisé.
 */
export async function sendContactNotification(
  payload: ContactPayload,
  fallbackTo: string,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY non configurée" };
  }

  const to = process.env.CONTACT_TO || fallbackTo;
  const from = process.env.CONTACT_FROM || "Dorian Detailing <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["Nom", payload.name],
    ["Email", payload.email],
    ["Téléphone", payload.phone || "—"],
    ["Véhicule", payload.vehicle || "—"],
    ["Prestation", payload.serviceName || "—"],
    [
      "Options",
      payload.optionNames?.length ? payload.optionNames.join(", ") : "—",
    ],
  ];

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#141413;line-height:1.6">
      <h2 style="margin:0 0 16px;font-size:18px">Nouvelle demande — site Dorian Detailing</h2>
      <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#5C5751">${label}</td><td style="padding:4px 0;font-weight:600">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:0 0 6px;color:#5C5751;font-size:13px">Message :</p>
      <div style="white-space:pre-wrap;font-size:14px;background:#F6F6F6;border:1px solid rgba(10,10,10,0.11);border-radius:10px;padding:14px">${escapeHtml(
        payload.message,
      )}</div>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: `Demande de ${payload.name}${
        payload.serviceName ? ` — ${payload.serviceName}` : ""
      }`,
      html,
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (error) {
    return { sent: false, error: error instanceof Error ? error.message : "inconnue" };
  }
}
