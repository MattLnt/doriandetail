import "server-only";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type { ActionState } from "@/lib/action-state";

/**
 * À appeler en tête de chaque Server Action du dashboard : une Server Action est un
 * endpoint public, le middleware ne la protège pas.
 */
export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");

  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true },
  });
  if (!admin) throw new Error("Non autorisé");

  return admin;
}

/** Transforme une erreur Prisma de contrainte d'unicité en message lisible. */
export function describeError(error: unknown, context: string): string {
  const code = (error as { code?: string } | null)?.code;
  if (code === "P2002") {
    return "Cet identifiant (slug) est déjà utilisé. Choisissez-en un autre.";
  }
  if (code === "P2025") {
    return "L'élément n'existe plus : il a peut-être déjà été supprimé.";
  }
  console.error(`[admin] ${context}`, error);
  return "Une erreur est survenue. Réessayez.";
}
