"use client";

import { useFormStatus } from "react-dom";

/** Bouton « Publier / Dépublier » utilisé dans les listes du dashboard. */
export function PublishToggle({ published }: { published: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-ghost btn-sm" disabled={pending}>
      {pending ? "…" : published ? "Dépublier" : "Publier"}
    </button>
  );
}
