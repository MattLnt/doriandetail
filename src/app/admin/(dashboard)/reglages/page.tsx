import { PageHeader } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Réglages du site" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        title="Réglages du site"
        description="Coordonnées, textes de la page d'accueil et réseaux sociaux. Ces informations sont reprises automatiquement sur l'ensemble du site."
      />

      <div className="flex flex-col gap-5">
        <SettingsForm
          values={{
            phone: settings.phone,
            email: settings.email,
            addressLine: settings.addressLine,
            city: settings.city,
            hours: settings.hours,
            instagram: settings.instagram,
            facebook: settings.facebook,
            tiktok: settings.tiktok,
            googleUrl: settings.googleUrl,
            googleReviewsUrl: settings.googleReviewsUrl,
            googleRating: settings.googleRating,
            googleReviewCount: settings.googleReviewCount,
            heroTitle: settings.heroTitle,
            heroText: settings.heroText,
            statVehicles: settings.statVehicles,
            boutiqueNote: settings.boutiqueNote,
          }}
        />
        <PasswordForm />
      </div>
    </>
  );
}
