function euroFormatter(fractionDigits: 0 | 2) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

const euroWhole = euroFormatter(0);
const euroDecimal = euroFormatter(2);

/**
 * Formate un montant stocké en centimes.
 * Un montant rond s'affiche sans décimales (« 110 € »), sinon avec deux
 * décimales (« 17,90 € ») — jamais « 17,9 € ».
 */
export function formatPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "Sur devis";
  const formatter = cents % 100 === 0 ? euroWhole : euroDecimal;
  return formatter.format(cents / 100);
}

/** Convertit une saisie utilisateur (« 110 », « 17,90 ») en centimes. */
export function parsePriceToCents(input: string | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  const cleaned = input.toString().trim().replace(/[€\s]/g, "").replace(",", ".");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** Affiche des centimes dans un champ de formulaire (« 110 », « 17.9 »). */
export function centsToInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toString();
}

const dateFormatter = new Intl.DateTimeFormat("fr-BE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}
