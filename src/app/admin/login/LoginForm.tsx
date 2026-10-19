"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "@/components/Icons";

import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(login, initialState);
  const [revealed, setRevealed] = useState(false);

  return (
    // Le titre est porte par la page : un <h1> ici en ferait un second.
    // backdrop-blur : la photo reste lisible autour, mais pas sous les champs.
    <form
      action={formAction}
      className="rounded-[18px] border border-dark-line bg-dark-2/80 p-6 backdrop-blur-md sm:p-7"
    >
      {state.error && (
        <p
          role="alert"
          className="mb-5 rounded-[10px] border border-[rgba(214,110,96,0.4)] bg-[rgba(214,110,96,0.14)] px-4 py-3 text-[13.5px] text-[#f0b3a8]"
        >
          {state.error}
        </p>
      )}

      {next && <input type="hidden" name="next" value={next} />}

      <div className="mb-4">
        <label htmlFor="email" className="label label-dark">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="field field-dark"
          required
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="label label-dark">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={revealed ? "text" : "password"}
            // Place pour le bouton, sinon le texte saisi passe dessous.
            className="field field-dark pr-11"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setRevealed((shown) => !shown)}
            // aria-pressed plutot qu'un simple libelle : le lecteur d'ecran
            // annonce l'etat du bouton, pas seulement son intitule.
            aria-pressed={revealed}
            aria-label={
              revealed ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-[10px] text-on-dark-faint transition-colors hover:text-on-dark focus-visible:text-on-dark"
          >
            {revealed ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
          </button>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-accent w-full py-3.5"
      disabled={pending}
    >
      {pending ? "Connexion…" : "Se connecter"}
      {!pending && <ArrowRightIcon size={14} />}
    </button>
  );
}
