import type { NextConfig } from "next";

/**
 * Les URL de l'ancien site WordPress. Elles sont toujours dans l'index de
 * Google et dans les liens entrants : sans ces redirections, chaque visiteur
 * venant d'une recherche tombait sur une 404 — et le referencement acquis
 * depuis 2022 partait avec. Redirections permanentes (308 : un 301 qui
 * conserve la methode), c'est ce que Google attend pour transferer l'historique.
 */
const WORDPRESS_REDIRECTS: { source: string; destination: string }[] = [
  // Pages de l'ancien site sans equivalent direct
  { source: "/a-propos", destination: "/" },
  { source: "/galerie", destination: "/prestations" },
  { source: "/prendre-rdv", destination: "/contact" },
  { source: "/rendez-vous", destination: "/contact" },
  { source: "/devis", destination: "/contact" },
  { source: "/mentions-legales-2", destination: "/mentions-legales" },
  { source: "/politique-de-confidentialite-et-cookies", destination: "/mentions-legales" },
  { source: "/politique-de-confidentialite", destination: "/mentions-legales" },
  { source: "/conditions-generales-de-vente", destination: "/mentions-legales" },

  // Anciennes pages de prestation → la formule correspondante
  { source: "/traitement-ceramique", destination: "/prestations/one-step-ceramique-3-5-ans" },
  { source: "/polissage-lustrage", destination: "/prestations/polissage" },
  { source: "/shampoing-sieges", destination: "/prestations/shampoing-des-sieges" },
  { source: "/shampoing-des-sieges", destination: "/prestations/shampoing-des-sieges" },
  { source: "/reconditionnement-complet", destination: "/prestations/renovation-esthetique-complete" },
  { source: "/reconditionnement-interieur", destination: "/prestations/reconditionnement-interieur" },
  { source: "/reconditionnement-exterieur", destination: "/prestations/detailing-exterieur" },
  { source: "/mini-detailing", destination: "/prestations/formule-essentielle" },
  { source: "/nettoyage-interieur", destination: "/prestations/reconditionnement-interieur" },
  { source: "/lavage-exterieur", destination: "/prestations/detailing-exterieur" },
  { source: "/abonnement", destination: "/prestations/abonnement-premium" },
  { source: "/services", destination: "/prestations" },
  { source: "/nos-services", destination: "/prestations" },
  { source: "/nos-prestations", destination: "/prestations" },
  { source: "/prix", destination: "/tarifs" },

  // Boutique WooCommerce : rayons, fiches produit, panier, compte
  { source: "/categorie-produit/:path*", destination: "/boutique" },
  { source: "/produit/:path*", destination: "/boutique" },
  { source: "/product/:path*", destination: "/boutique" },
  { source: "/product-category/:path*", destination: "/boutique" },
  { source: "/etiquette-produit/:path*", destination: "/boutique" },
  { source: "/panier", destination: "/boutique" },
  { source: "/commander", destination: "/boutique" },
  { source: "/mon-compte/:path*", destination: "/boutique" },
  { source: "/boutique/page/:page", destination: "/boutique" },

  // Plomberie WordPress : plans de site, flux, pagination du blog
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/feed", destination: "/" },
  { source: "/comments/feed", destination: "/" },
  { source: "/blog/:path*", destination: "/" },
  { source: "/category/:path*", destination: "/" },
  { source: "/author/:path*", destination: "/" },
  { source: "/tag/:path*", destination: "/" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // Une seule adresse canonique : www renvoie sur l'apex. Les deux
      // repondaient en 200, Google voyait deux sites et partageait le
      // referencement entre eux.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.doriandetailing.be" }],
        destination: "https://doriandetailing.be/:path*",
        permanent: true,
      },
      ...WORDPRESS_REDIRECTS.map((rule) => ({ ...rule, permanent: true })),
    ];
  },
};

export default nextConfig;
