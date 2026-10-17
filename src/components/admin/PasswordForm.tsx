"use client";

import { useActionState } from "react";

import { changePassword } from "@/app/admin/(dashboard)/reglages/actions";
import { Feedback, Panel, SubmitButton } from "@/components/admin/ui";
import { idleState } from "@/lib/action-state";

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, idleState);

  return (
    <Panel
      title="Mot de passe"
      description="Au moins 10 caractères. Vous resterez connecté après le changement."
    >
      <form
        action={formAction}
        key={state.status === "success" ? "done" : "editing"}
        className="flex flex-col gap-4"
      >
        <Feedback state={state} />

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="current" className="label">
              Mot de passe actuel
            </label>
            <input
              id="current"
              name="current"
              type="password"
              className="field"
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label htmlFor="next" className="label">
              Nouveau mot de passe
            </label>
            <input
              id="next"
              name="next"
              type="password"
              className="field"
              autoComplete="new-password"
              required
              minLength={10}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="label">
              Confirmation
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              className="field"
              autoComplete="new-password"
              required
              minLength={10}
            />
          </div>
        </div>

        <div>
          <SubmitButton label="Changer le mot de passe" className="btn btn-primary btn-sm" />
        </div>
      </form>
    </Panel>
  );
}
