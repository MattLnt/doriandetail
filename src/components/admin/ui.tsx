"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

import { Checkbox } from "@/components/Checkbox";
import { Select, type SelectOption } from "@/components/Select";

/** En-tête de page du dashboard, avec action principale optionnelle. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-5">
      <div>
        <h1 className="text-[26px] font-bold">{title}</h1>
        {description && (
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-dim">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-primary btn-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-line bg-bg p-6 md:p-7">
      {title && <h2 className="text-[17px] font-bold">{title}</h2>}
      {description && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">{description}</p>
      )}
      <div className={title ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

export function SubmitButton({
  label = "Enregistrer",
  pendingLabel = "Enregistrement…",
  className = "btn btn-primary",
}: {
  label?: string;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

/** Bouton de suppression : demande confirmation avant de soumettre. */
export function DeleteButton({
  label = "Supprimer",
  confirmMessage,
  className = "btn btn-danger btn-sm",
}: {
  label?: string;
  confirmMessage: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {pending ? "Suppression…" : label}
    </button>
  );
}

export function Feedback({
  state,
}: {
  state: { status?: "idle" | "success" | "error"; message?: string };
}) {
  if (!state.message || state.status === "idle") return null;
  const isError = state.status === "error";
  return (
    <p
      role={isError ? "alert" : "status"}
      className={`rounded-[10px] px-4 py-3 text-[13.5px] ${
        isError
          ? "border border-[rgba(224,122,108,0.38)] bg-[rgba(224,122,108,0.12)] text-[#e8907f]"
          : "border border-[rgba(92,190,133,0.34)] bg-[rgba(92,190,133,0.11)] text-[#7fd4a3]"
      }`}
    >
      {state.message}
    </p>
  );
}

/** Case a cocher isolee du dashboard. Enveloppe Checkbox pour garder les
    appels existants (`<Toggle name label hint defaultChecked />`). */
export function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <Checkbox
      name={name}
      label={label}
      hint={hint}
      defaultChecked={defaultChecked}
      align="start"
    />
  );
}

export function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  required,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  type?: string;
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
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
      />
      {hint && <p className="hint">{hint}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function TextArea({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  rows = 4,
  error,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="field"
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {hint && <p className="hint">{hint}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  hint,
  placeholder,
}: {
  name: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string | null;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      {/* htmlFor vise le bouton du composant, qui porte ce meme id. */}
      <label htmlFor={`${name}-bouton`} className="label">
        {label}
      </label>
      <Select
        id={`${name}-bouton`}
        name={name}
        options={options}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-[16px] border border-dashed border-line bg-bg p-10 text-center">
      <p className="text-[15px] font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-[400px] text-[13.5px] leading-relaxed text-ink-faint">
        {description}
      </p>
      {action && (
        <Link href={action.href} className="btn btn-primary btn-sm mt-5">
          {action.label}
        </Link>
      )}
    </div>
  );
}
