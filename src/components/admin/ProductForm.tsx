"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ImageField } from "@/components/admin/ImageField";
import {
  Feedback,
  Panel,
  SelectField,
  SubmitButton,
  TextArea,
  TextField,
  Toggle,
} from "@/components/admin/ui";
import { idleState, type ActionState } from "@/lib/action-state";

export type ProductFormValues = {
  name: string;
  slug: string;
  categoryId: string | null;
  description: string | null;
  format: string | null;
  brand: string | null;
  price: string;
  imageUrl: string | null;
  position: number;
  published: boolean;
  featured: boolean;
};

export function ProductForm({
  action,
  values,
  categories,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  values: ProductFormValues;
  categories: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, idleState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />

      <Panel title="Le produit">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="name" label="Nom du produit" defaultValue={values.name} required />
            <TextField
              name="slug"
              label="Identifiant d'URL"
              defaultValue={values.slug}
              placeholder="généré depuis le nom"
            />
          </div>

          <TextArea
            name="description"
            label="Description"
            defaultValue={values.description}
            rows={3}
            hint="Une ou deux phrases : usage, bénéfice, particularité."
          />

          <div className="grid gap-4 md:grid-cols-3">
            <SelectField
              name="categoryId"
              label="Rayon"
              defaultValue={values.categoryId}
              placeholder="Aucun rayon"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              hint="Un produit sans rayon n'apparaît dans aucun filtre."
            />
            <TextField
              name="format"
              label="Contenance / format"
              defaultValue={values.format}
              placeholder="500 ml"
            />
            <TextField
              name="brand"
              label="Marque"
              defaultValue={values.brand}
              placeholder="Optionnel"
            />
          </div>

          <div className="max-w-[200px]">
            <TextField
              name="price"
              label="Prix indicatif (€)"
              defaultValue={values.price}
              placeholder="17,90"
              required
              hint="Prix affiché à titre informatif."
            />
          </div>
        </div>
      </Panel>

      <Panel title="Visuel">
        <ImageField defaultValue={values.imageUrl} />
      </Panel>

      <Panel title="Affichage">
        <div className="flex flex-col gap-4">
          <Toggle
            name="published"
            label="Visible dans la boutique"
            defaultChecked={values.published}
          />
          <Toggle
            name="featured"
            label="Marquer « Recommandé »"
            hint="Ajoute un badge sur la vignette du produit."
            defaultChecked={values.featured}
          />
          <div className="max-w-[160px]">
            <TextField
              name="position"
              label="Ordre d'affichage"
              type="number"
              defaultValue={String(values.position)}
            />
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Link href="/admin/produits" className="btn btn-ghost">
          Retour à la liste
        </Link>
      </div>
    </form>
  );
}
