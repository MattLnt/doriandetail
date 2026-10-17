/**
 * État partagé entre les Server Actions du dashboard et les formulaires clients.
 * Ce module doit rester importable depuis un composant client : aucun import serveur.
 */
export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const idleState: ActionState = { status: "idle" };
