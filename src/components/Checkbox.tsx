import { CheckIcon } from "@/components/Icons";

/**
 * Case a cocher aux couleurs du site.
 *
 * L'input natif est conserve et simplement rendu invisible : il garde le
 * focus clavier, la semantique pour les lecteurs d'ecran et l'envoi dans le
 * FormData. Le carre colore n'est qu'un decor pilote par `peer-checked`.
 * Remplacer l'input par un <div> aurait casse les trois.
 */
export function Checkbox({
  name,
  label,
  hint,
  value,
  defaultChecked,
  align = "center",
}: {
  name: string;
  label: string;
  hint?: string;
  value?: string;
  defaultChecked?: boolean;
  /** « start » quand le libelle tient sur plusieurs lignes. */
  align?: "center" | "start";
}) {
  return (
    <label
      className={`group flex cursor-pointer gap-3 ${
        align === "start" ? "items-start" : "items-center"
      }`}
    >
      <span
        className={`relative flex-shrink-0 ${align === "start" ? "mt-0.5" : ""}`}
      >
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          className="peer size-[19px] cursor-pointer appearance-none rounded-[6px] border border-line bg-white/5 transition-colors checked:border-transparent checked:bg-[linear-gradient(135deg,#d4a093_0%,var(--color-accent)_50%,#b1705f_100%)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-soft group-hover:border-accent/60"
        />
        <CheckIcon
          size={13}
          strokeWidth={3}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 text-accent-ink opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      <span>
        <span className="block text-[13.5px] font-medium leading-snug">
          {label}
        </span>
        {hint && (
          <span className="block text-[12.5px] text-ink-faint">{hint}</span>
        )}
      </span>
    </label>
  );
}
