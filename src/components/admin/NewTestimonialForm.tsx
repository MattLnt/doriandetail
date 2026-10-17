"use client";

import { useActionState } from "react";

import { createTestimonial } from "@/app/admin/(dashboard)/avis/actions";
import { Feedback, Panel, SubmitButton } from "@/components/admin/ui";
import { idleState } from "@/lib/action-state";

export function NewTestimonialForm({ nextPosition }: { nextPosition: number }) {
  const [state, formAction] = useActionState(createTestimonial, idleState);

  return (
    <Panel title="Ajouter un avis">
      <form
        action={formAction}
        key={state.status === "success" ? `done-${state.message}` : "new"}
        className="flex flex-col gap-4"
      >
        <Feedback state={state} />

        <div className="grid gap-4 md:grid-cols-[1fr_1fr_100px_100px]">
          <div>
            <label htmlFor="new-author" className="label">
              Auteur
            </label>
            <input
              id="new-author"
              name="author"
              className="field"
              placeholder="Client Google"
              required
            />
          </div>
          <div>
            <label htmlFor="new-location" className="label">
              Localité
            </label>
            <input
              id="new-location"
              name="location"
              className="field"
              placeholder="Braine-l'Alleud"
            />
          </div>
          <div>
            <label htmlFor="new-rating" className="label">
              Étoiles
            </label>
            <select id="new-rating" name="rating" className="field" defaultValue="5">
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="new-position" className="label">
              Ordre
            </label>
            <input
              id="new-position"
              name="position"
              type="number"
              className="field"
              defaultValue={nextPosition}
            />
          </div>
        </div>

        <div>
          <label htmlFor="new-content" className="label">
            Avis
          </label>
          <textarea
            id="new-content"
            name="content"
            rows={3}
            className="field"
            placeholder="Voiture rendue comme à la sortie du concessionnaire…"
            required
          />
        </div>

        <input type="hidden" name="published" value="on" />

        <div>
          <SubmitButton label="Ajouter l'avis" className="btn btn-primary btn-sm" />
        </div>
      </form>
    </Panel>
  );
}
