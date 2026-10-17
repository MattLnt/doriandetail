"use client";

import { useActionState } from "react";

import { createCategory } from "@/app/admin/(dashboard)/rayons/actions";
import { Feedback, Panel, SubmitButton } from "@/components/admin/ui";
import { idleState } from "@/lib/action-state";

export function NewCategoryForm({ nextPosition }: { nextPosition: number }) {
  const [state, formAction] = useActionState(createCategory, idleState);

  return (
    <Panel title="Ajouter un rayon">
      <form
        action={formAction}
        key={state.status === "success" ? `done-${state.message}` : "new"}
        className="flex flex-col gap-4"
      >
        <Feedback state={state} />

        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="new-category-name" className="label">
              Nom du rayon
            </label>
            <input
              id="new-category-name"
              name="name"
              className="field"
              placeholder="Protection & cire"
              required
            />
          </div>
          <div className="w-[100px]">
            <label htmlFor="new-category-position" className="label">
              Ordre
            </label>
            <input
              id="new-category-position"
              name="position"
              type="number"
              className="field"
              defaultValue={nextPosition}
            />
          </div>
          <SubmitButton label="Ajouter" className="btn btn-primary btn-sm" />
        </div>
      </form>
    </Panel>
  );
}
