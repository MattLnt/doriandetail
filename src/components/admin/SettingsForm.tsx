"use client";

import { useActionState } from "react";

import { updateSettings } from "@/app/admin/(dashboard)/reglages/actions";
import {
  Feedback,
  Panel,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/admin/ui";
import { idleState } from "@/lib/action-state";

export type SettingsValues = {
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  hours: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  googleUrl: string | null;
  googleReviewsUrl: string | null;
  googleRating: string;
  googleReviewCount: number;
  heroTitle: string;
  heroText: string;
  statVehicles: string;
  statRating: string;
  boutiqueNote: string;
};

export function SettingsForm({ values }: { values: SettingsValues }) {
  const [state, formAction] = useActionState(updateSettings, idleState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Feedback state={state} />

      <Panel title="Coordonnées">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="phone" label="Téléphone" defaultValue={values.phone} required />
            <TextField
              name="email"
              label="Email"
              type="email"
              defaultValue={values.email}
              required
              hint="Destinataire par défaut des demandes de contact."
            />
            <TextField
              name="addressLine"
              label="Adresse"
              defaultValue={values.addressLine}
              required
            />
            <TextField
              name="city"
              label="Code postal et ville"
              defaultValue={values.city}
              required
            />
          </div>

          <TextArea
            name="hours"
            label="Horaires"
            defaultValue={values.hours}
            rows={4}
            hint="Une ligne par jour ou par plage horaire."
          />
        </div>
      </Panel>

      <Panel
        title="Réseaux sociaux"
        description="Laissez vide pour masquer l'icône correspondante."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            name="instagram"
            label="Instagram"
            defaultValue={values.instagram}
            placeholder="https://instagram.com/…"
          />
          <TextField
            name="facebook"
            label="Facebook"
            defaultValue={values.facebook}
            placeholder="https://facebook.com/…"
          />
          <TextField
            name="tiktok"
            label="TikTok"
            defaultValue={values.tiktok}
            placeholder="https://tiktok.com/@…"
          />
        </div>
      </Panel>

      <Panel
        title="Avis Google"
        description="La note et le nombre d'avis ne se mettent pas à jour tout seuls : pensez à les revérifier sur la fiche de temps en temps."
      >
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              name="googleRating"
              label="Note affichée"
              defaultValue={values.googleRating}
              placeholder="5,0"
            />
            <TextField
              name="googleReviewCount"
              label="Nombre d'avis"
              type="number"
              defaultValue={String(values.googleReviewCount)}
              placeholder="140"
            />
          </div>
          <TextField
            name="googleUrl"
            label="Lien vers la fiche Google"
            defaultValue={values.googleUrl}
            placeholder="https://maps.google.com/?cid=…"
          />
          <TextField
            name="googleReviewsUrl"
            label="Lien direct vers les avis"
            defaultValue={values.googleReviewsUrl}
            placeholder="https://search.google.com/local/reviews?placeid=…"
            hint="Laissez vide pour masquer le bloc d'avis Google sur l'accueil."
          />
        </div>
      </Panel>

      <Panel title="Page d'accueil">
        <div className="flex flex-col gap-4">
          <TextArea
            name="heroTitle"
            label="Titre principal"
            defaultValue={values.heroTitle}
            rows={2}
          />
          <TextArea
            name="heroText"
            label="Texte d'introduction"
            defaultValue={values.heroText}
            rows={3}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              name="statVehicles"
              label="Chiffre « véhicules traités »"
              defaultValue={values.statVehicles}
              placeholder="500+"
            />
            <TextField
              name="statRating"
              label="Chiffre « avis clients »"
              defaultValue={values.statRating}
              placeholder="4.9 / 5"
            />
          </div>
        </div>
      </Panel>

      <Panel title="Boutique">
        <TextArea
          name="boutiqueNote"
          label="Mention affichée en bas de la boutique"
          defaultValue={values.boutiqueNote}
          rows={3}
          hint="Rappelle au visiteur comment commander, puisque la vente en ligne est désactivée."
        />
      </Panel>

      <div>
        <SubmitButton label="Enregistrer les réglages" />
      </div>
    </form>
  );
}
