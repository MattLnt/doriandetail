import type { Metadata } from "next";
import Link from "next/link";

import { MailIcon, PhoneIcon } from "@/components/Icons";
import { ContentUnavailable } from "@/components/site/ContentUnavailable";
import { ShopGrid } from "@/components/site/ShopGrid";
import { getSettingsOrFallback, getShopDataOrEmpty } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Les produits de detailing que nous utilisons et recommandons en atelier. Vitrine informative : la commande se fait par téléphone, email ou directement à l'atelier.",
};

export default async function BoutiquePage() {
  const [{ categories, products }, settings] = await Promise.all([
    getShopDataOrEmpty(),
    getSettingsOrFallback(),
  ]);

  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <>
      <section className="border-b border-line py-14 md:py-16">
        <div className="shell">
          <div className="max-w-[640px]">
            <p className="eyebrow">Boutique</p>
            <h1 className="mb-4 mt-3 text-[clamp(30px,4vw,44px)] font-bold leading-tight">
              Les produits que nous utilisons en atelier
            </h1>
            <p className="text-[16px] leading-relaxed text-ink-dim">
              Une sélection de références detailing que nous recommandons et utilisons sur
              vos véhicules. Cette boutique est une vitrine : pour commander,
              contactez-nous par téléphone, email ou directement à l&apos;atelier.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14">
        <div className="shell">
          {products.length === 0 ? (
            <ContentUnavailable>
              La boutique n&apos;est pas accessible pour le moment.
            </ContentUnavailable>
          ) : (
            <ShopGrid categories={categories} products={products} />
          )}
        </div>
      </section>

      <section className="border-t border-line bg-surface py-14 md:py-16">
        <div className="shell flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-[560px]">
            <h2 className="mb-2.5 text-[clamp(22px,2.4vw,28px)] font-bold">
              Un produit vous intéresse ?
            </h2>
            <p className="text-[14.5px] leading-relaxed text-ink-dim">
              {settings.boutiqueNote}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={telHref} className="btn btn-ghost">
              <PhoneIcon size={15} />
              {settings.phone}
            </a>
            <Link href="/contact" className="btn btn-primary">
              <MailIcon size={15} />
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
