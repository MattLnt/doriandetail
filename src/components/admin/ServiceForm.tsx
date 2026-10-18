"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  Feedback,
  Panel,
  SelectField,
  SubmitButton,
  TextArea,
  TextField,
  Toggle,
} from "@/components/admin/ui";
import { SERVICE_ICON_LABELS } from "@/components/Icons";
import { idleState, type ActionState } from "@/lib/action-state";

type VehicleClass = { id: string; name: string };
type OptionRow = { id: string; name: string; priceLabel: string };
type GroupRow = { id: string; name: string };

export type ServiceFormValues = {
  name: string;
  slug: string;
  groupId: string | null;
  icon: string;
  tagline: string | null;
  description: string | null;
  badge: string | null;
  position: number;
  published: boolean;
  featured: boolean;
  quoteOnly: boolean;
  inclusionsText: string;
  /** Valeurs des champs prix, indexées par identifiant de gabarit */
  prices: Record<string, { price: string; promo: string }>;
  selectedOptionIds: string[];
};

export function ServiceForm({
  action,
  values,
  vehicleClasses,
  options,
  groups,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  values: ServiceFormValues;
  vehicleClasses: VehicleClass[];
  options: OptionRow[];
  groups: GroupRow[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, idleState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />

      <Panel title="Présentation">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="name" label="Nom de la prestation" defaultValue={values.name} required />
            <TextField
              name="slug"
              label="Identifiant d'URL"
              defaultValue={values.slug}
              placeholder="généré depuis le nom"
              hint="Adresse de la fiche : /prestations/mon-identifiant"
            />
          </div>

          <TextArea
            name="tagline"
            label="Phrase d'accroche"
            defaultValue={values.tagline}
            rows={3}
            hint="Affichée sur la carte et en haut de la fiche."
          />

          <TextArea
            name="description"
            label="Précision complémentaire"
            defaultValue={values.description}
            rows={2}
            hint="Optionnel : mention légale, durée de protection, condition particulière…"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <SelectField
              name="groupId"
              label="Famille"
              defaultValue={values.groupId}
              placeholder="Aucune"
              options={groups.map((group) => ({ value: group.id, label: group.name }))}
            />
            <SelectField
              name="icon"
              label="Icône"
              defaultValue={values.icon}
              options={Object.entries(SERVICE_ICON_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
            <TextField
              name="badge"
              label="Badge"
              defaultValue={values.badge}
              placeholder="Le plus réservé"
              hint="Laissez vide pour ne rien afficher."
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Ce qui est inclus"
        description="Une ligne par élément. L'ordre de saisie est l'ordre d'affichage."
      >
        <TextArea
          name="inclusions"
          label="Liste des inclusions"
          defaultValue={values.inclusionsText}
          rows={14}
          placeholder={"Pré-lavage à la mousse active\nLavage complet de la carrosserie"}
        />
      </Panel>

      <Panel
        title="Tarifs par gabarit"
        description="Laissez un champ vide pour afficher « Sur devis » sur ce gabarit. Le prix promo, s'il est renseigné, remplace le tarif affiché et barre l'ancien."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="pb-2.5 pr-4 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint">
                  Gabarit
                </th>
                <th className="pb-2.5 pr-4 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint">
                  Tarif (€)
                </th>
                <th className="pb-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint">
                  Promo (€)
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicleClasses.map((vc) => (
                <tr key={vc.id} className="border-b border-line last:border-0">
                  <td className="py-3 pr-4 text-[14px] font-medium">{vc.name}</td>
                  <td className="py-3 pr-4">
                    <input
                      name={`price_${vc.id}`}
                      type="text"
                      inputMode="decimal"
                      className="field max-w-[130px]"
                      defaultValue={values.prices[vc.id]?.price ?? ""}
                      placeholder="—"
                      aria-label={`Tarif ${vc.name}`}
                    />
                  </td>
                  <td className="py-3">
                    <input
                      name={`promo_${vc.id}`}
                      type="text"
                      inputMode="decimal"
                      className="field max-w-[130px]"
                      defaultValue={values.prices[vc.id]?.promo ?? ""}
                      placeholder="—"
                      aria-label={`Prix promo ${vc.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <Toggle
            name="quoteOnly"
            label="Prestation uniquement sur devis"
            hint="Masque tous les tarifs sur le site, quels que soient les montants saisis ci-dessus."
            defaultChecked={values.quoteOnly}
          />
        </div>
      </Panel>

      <Panel
        title="Options proposées"
        description="Cochez les suppléments que le client peut ajouter à cette prestation."
      >
        {options.length === 0 ? (
          <p className="text-[13.5px] text-ink-faint">
            Aucune option enregistrée.{" "}
            <Link href="/admin/options" className="font-semibold text-accent-deep">
              En créer une →
            </Link>
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="options"
                  value={option.id}
                  defaultChecked={values.selectedOptionIds.includes(option.id)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#A6543D]"
                />
                <span>
                  <span className="block text-[13.5px] font-medium leading-snug">
                    {option.name}
                  </span>
                  <span className="block text-[12.5px] text-ink-faint">
                    +{option.priceLabel}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Affichage">
        <div className="flex flex-col gap-4">
          <Toggle
            name="published"
            label="Visible sur le site"
            hint="Décochez pour garder la prestation en brouillon."
            defaultChecked={values.published}
          />
          <Toggle
            name="featured"
            label="Mettre en avant"
            hint="Carte mise en valeur et éligible au bloc tarifs de la page d'accueil."
            defaultChecked={values.featured}
          />
          <div className="max-w-[160px]">
            <TextField
              name="position"
              label="Ordre d'affichage"
              type="number"
              defaultValue={String(values.position)}
              hint="Du plus petit au plus grand."
            />
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Link href="/admin/prestations" className="btn btn-ghost">
          Retour à la liste
        </Link>
      </div>
    </form>
  );
}
