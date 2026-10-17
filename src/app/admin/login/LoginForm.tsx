"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="rounded-[18px] border border-line bg-white p-7">
      <h1 className="mb-6 text-[19px] font-bold">Connexion</h1>

      {state.error && (
        <p
          role="alert"
          className="mb-5 rounded-[10px] border border-[rgba(176,58,46,0.3)] bg-[rgba(176,58,46,0.06)] px-4 py-3 text-[13.5px] text-[#b03a2e]"
        >
          {state.error}
        </p>
      )}

      {next && <input type="hidden" name="next" value={next} />}

      <div className="mb-4">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="field"
          required
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="label">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          required
          autoComplete="current-password"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}
