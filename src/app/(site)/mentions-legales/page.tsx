import type { Metadata } from "next";

import { getSettingsOrFallback } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default async function MentionsLegalesPage() {
  const settings = await getSettingsOrFallback();

  return (
    <section className="py-14 md:py-16">
      <div className="shell max-w-[720px]">
        <p className="eyebrow">Informations</p>
        <h1 className="mb-8 mt-3 text-[clamp(28px,3.4vw,38px)] font-bold">
          Mentions légales
        </h1>

        <div className="flex flex-col gap-8 text-[14.5px] leading-relaxed text-ink-dim">
          <Block title="Éditeur du site">
            Dorian Detailing
            <br />
            {settings.addressLine}
            <br />
            {settings.city}
            <br />
            Téléphone : {settings.phone}
            <br />
            Email : {settings.email}
            <br />
            <span className="text-ink-faint">
              Numéro d&apos;entreprise (BCE) : à compléter
            </span>
          </Block>

          <Block title="Activité">
            Centre de detailing automobile : nettoyage, reconditionnement, polissage et
            protection céramique de véhicules, réalisés en atelier à Braine-l&apos;Alleud.
          </Block>

          <Block title="Tarifs et devis">
            Les tarifs publiés sur ce site sont indicatifs et dépendent du gabarit du
            véhicule ainsi que de son état réel. Un devis est systématiquement confirmé
            avant toute intervention. Ce site ne permet ni la réservation ni le paiement en
            ligne : le règlement s&apos;effectue à l&apos;atelier.
          </Block>

          <Block title="Boutique">
            Les produits présentés dans la boutique le sont à titre informatif. Ils ne sont
            pas vendus en ligne ; leur disponibilité et leur prix sont confirmés par
            l&apos;atelier.
          </Block>

          <Block title="Données personnelles">
            Les informations transmises via le formulaire de contact (nom, email,
            téléphone, véhicule, message) sont utilisées uniquement pour traiter votre
            demande et vous recontacter. Elles ne sont ni revendues ni transmises à des
            tiers à des fins commerciales. Vous pouvez demander leur consultation, leur
            rectification ou leur suppression en écrivant à {settings.email}.
          </Block>

          <Block title="Propriété intellectuelle">
            L&apos;ensemble des contenus de ce site (textes, visuels, identité graphique)
            est la propriété de Dorian Detailing, sauf mention contraire. Toute
            reproduction sans autorisation est interdite.
          </Block>
        </div>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2.5 text-[17px] font-semibold text-ink">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
