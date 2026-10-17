"use client";

import { useActionState } from "react";

import { createOption } from "@/app/admin/(dashboard)/options/actions";
import { Feedback, Panel, SubmitButton } from "@/components/admin/ui";
import { idleState } from "@/lib/action-state";

export function NewOptionForm({ nextPosition }: { nextPosition: number }) {
  const [state, formAction] = useActionState(createOption, idleState);

  return (
    <Panel title="Ajouter une option">
      {/* key force la réinitialisation des champs après un ajout réussi */}
      <form
        action={formAction}
        key={state.status === "success" ? `done-${state.message}` : "new"}
        className="flex flex-col gap-4"
      >
        <Feedback state={state} />

        <div className="grid gap-4 md:grid-cols-[1fr_130px_110px]">
          <div>
            <label htmlFor="new-option-name" className="label">
              Nom
            </label>
            <input
              id="new-option-name"
              name="name"
              className="field"
              placeholder="Nettoyage du ciel de toit"
              required
            />
          </div>
          <div>
            <label htmlFor="new-option-price" className="label">
              Prix (€)
            </label>
            <input
              id="new-option-price"
              name="price"
              className="field"
              inputMode="decimal"
              placeholder="70"
              required
            />
          </div>
          <div>
            <label htmlFor="new-option-position" className="label">
              Ordre
            </label>
            <input
              id="new-option-position"
              name="position"
              type="number"
              className="field"
              defaultValue={nextPosition}
            />
          </div>
        </div>

        <div>
          <label htmlFor="new-option-description" className="label">
            Description
          </label>
          <input
            id="new-option-description"
            name="description"
            className="field"
            placeholder="Optionnel"
          />
        </div>

        <input type="hidden" name="published" value="on" />

        <div>
          <SubmitButton label="Ajouter l'option" className="btn btn-primary btn-sm" />
        </div>
      </form>
    </Panel>
  );
}
