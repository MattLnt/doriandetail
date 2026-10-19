"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { CheckIcon } from "@/components/Icons";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { Select } from "@/components/Select";

const initialState: ContactState = { status: "idle" };

type ServiceOption = { slug: string; name: string };

export function ContactForm({
  services,
  defaultServiceSlug,
  defaultMessage,
}: {
  services: ServiceOption[];
  defaultServiceSlug?: string;
  defaultMessage?: string;
}) {
  const [state, formAction] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div className="card flex flex-col items-start gap-4 p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
          <CheckIcon size={20} />
        </span>
        <h2 className="text-[19px] font-bold">Demande envoyée</h2>
        <p className="text-[14.5px] leading-relaxed text-ink-dim">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card flex flex-col gap-4 p-7 md:p-9" noValidate>
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-[10px] border border-[rgba(176,58,46,0.3)] bg-[rgba(176,58,46,0.06)] px-4 py-3 text-[13.5px] text-[#b03a2e]"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Nom"
          required
          autoComplete="name"
          error={state.fieldErrors?.name}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
        />
        <Field
          name="phone"
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          error={state.fieldErrors?.phone}
        />
        <Field
          name="vehicle"
          label="Véhicule"
          placeholder="Marque, modèle, année"
          error={state.fieldErrors?.vehicle}
        />
      </div>

      <div>
        <label htmlFor="serviceSlug-bouton" className="label">
          Prestation souhaitée
        </label>
        <Select
          id="serviceSlug-bouton"
          name="serviceSlug"
          defaultValue={defaultServiceSlug ?? ""}
          placeholder="Je ne sais pas encore / autre demande"
          options={services.map((service) => ({
            value: service.slug,
            label: service.name,
          }))}
        />
      </div>

      <div>
        <label htmlFor="message" className="label">
          Message <span aria-hidden>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="field"
          required
          defaultValue={defaultMessage}
          placeholder="Décrivez l'état de votre véhicule et vos disponibilités."
          aria-invalid={Boolean(state.fieldErrors?.message)}
        />
        {state.fieldErrors?.message && (
          <p className="error-text">{state.fieldErrors.message}</p>
        )}
      </div>

      {/* Leurre anti-spam — masqué aux lecteurs d'écran et aux visiteurs. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company">Société</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="hint">
        Aucun paiement en ligne : nous vous recontactons pour confirmer le créneau et le
        devis, le règlement se fait à l&apos;atelier.
      </p>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Envoi en cours…" : "Envoyer le message"}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="field"
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
