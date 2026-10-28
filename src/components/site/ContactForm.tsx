"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { CheckIcon } from "@/components/Icons";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { Checkbox } from "@/components/Checkbox";
import { Select } from "@/components/Select";
import { formatPrice } from "@/lib/format";

const initialState: ContactState = { status: "idle" };

type ServiceOption = {
  slug: string;
  name: string;
  options: {
    option: { id: string; name: string; priceCents: number; published: boolean };
  }[];
};

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
  const [serviceSlug, setServiceSlug] = useState(defaultServiceSlug ?? "");

  // Les options proposees suivent la prestation choisie. Une option
  // depubliee entre-temps ne doit plus apparaitre.
  const available = (
    services.find((service) => service.slug === serviceSlug)?.options ?? []
  )
    .map((link) => link.option)
    .filter((option) => option.published);

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
          onValueChange={setServiceSlug}
        />
      </div>

      {/* Options de la prestation. Le bloc n'existe que lorsqu'une prestation
          en propose : afficher un cadre vide n'apprend rien au visiteur. */}
      {available.length > 0 && (
        <fieldset className="rounded-[14px] border border-line bg-surface p-5">
          <legend className="px-1.5 text-[13px] font-semibold">
            Options souhaitées
          </legend>
          <p className="mb-4 text-[13px] leading-relaxed text-ink-faint">
            Facultatif. Les suppléments sont ajoutés au devis, rien n&apos;est
            payé en ligne.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {available.map((option) => (
              <Checkbox
                key={option.id}
                name="options"
                value={option.id}
                label={option.name}
                hint={`+${formatPrice(option.priceCents)}`}
                align="start"
              />
            ))}
          </div>
        </fieldset>
      )}

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

      {/* Leurre anti-spam — masqué aux lecteurs d'écran et aux visiteurs.
          Le nom du champ ne doit ressembler à aucun champ connu des
          navigateurs : un « company » étiqueté « Société » se fait
          auto-remplir par Chrome, et la demande d'un vrai client partait
          alors à la poubelle sans que personne ne le sache. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input
          id="dd-hp"
          name="dd_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />
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
