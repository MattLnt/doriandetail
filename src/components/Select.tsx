"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CheckIcon } from "@/components/Icons";

export type SelectOption = { value: string; label: string };

/**
 * Liste deroulante aux couleurs du site.
 *
 * Le <select> natif n'est pas stylable : le navigateur dessine le menu
 * lui-meme, et sous Windows il reste blanc quoi qu'on fasse. D'ou ce
 * composant.
 *
 * Deux garde-fous :
 *
 * - la valeur part dans un <input type="hidden">, donc les Server Actions
 *   continuent de la lire dans le FormData comme avec un <select> ;
 * - le motif ARIA combobox est respecte (role, aria-expanded, aria-activedescendant)
 *   et le clavier fonctionne : fleches, Home, Fin, Entree, Echap, et saisie
 *   de la premiere lettre.
 */
export function Select({
  name,
  options,
  defaultValue,
  placeholder = "Sélectionner…",
  id,
  required,
  invalid,
}: {
  name: string;
  options: SelectOption[];
  defaultValue?: string | null;
  placeholder?: string;
  id?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  const generatedId = useId();
  const buttonId = id ?? `${generatedId}-bouton`;
  const listId = `${generatedId}-liste`;

  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  // Option survolée au clavier, distincte de l'option retenue.
  const [cursor, setCursor] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === (defaultValue ?? "")),
    ),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = options.find((option) => option.value === value);

  // Fermeture au clic en dehors : sans ca, le menu reste ouvert derriere
  // d'autres elements de la page.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // L'option au curseur doit rester visible quand la liste deborde.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [open, cursor]);

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    setCursor(index);
    setOpen(false);
    rootRef.current?.querySelector("button")?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setCursor((current) =>
          Math.min(options.length - 1, Math.max(0, current + step)),
        );
        return;
      }
      case "Home":
        if (open) {
          event.preventDefault();
          setCursor(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setCursor(options.length - 1);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(cursor);
        else setOpen(true);
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      default: {
        // Saisie d'une lettre : on saute a l'option correspondante, comme le
        // fait un <select> natif.
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
        const needle = event.key.toLowerCase();
        const found = options.findIndex((option) =>
          option.label.toLowerCase().startsWith(needle),
        );
        if (found >= 0) {
          setCursor(found);
          if (!open) choose(found);
        }
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={buttonId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required}
        aria-invalid={invalid}
        aria-activedescendant={open ? `${listId}-${cursor}` : undefined}
        onClick={() => setOpen((shown) => !shown)}
        onKeyDown={onKeyDown}
        className={`field flex items-center justify-between gap-3 text-left ${
          selected ? "" : "text-ink-faint"
        } ${open ? "border-accent" : ""}`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`flex-shrink-0 text-ink-faint transition-transform duration-150 ${
            open ? "-rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
          className="select-menu absolute z-30 mt-1.5 max-h-[260px] w-full overflow-auto p-1.5"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                // onPointerDown plutot que onClick : le bouton perdrait le
                // focus avant que le clic n'aboutisse.
                onPointerDown={(event) => {
                  event.preventDefault();
                  choose(index);
                }}
                onPointerEnter={() => setCursor(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-[14px] transition-colors ${
                  index === cursor ? "bg-accent-soft text-ink" : "text-ink-dim"
                } ${isSelected ? "font-semibold" : ""}`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <CheckIcon size={14} className="flex-shrink-0 text-accent" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
