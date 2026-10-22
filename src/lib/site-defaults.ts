import type { SiteSettings } from "@prisma/client";

/**
 * Repli affiche par les pages publiques quand la base est injoignable : sans lui,
 * la moindre coupure Postgres renvoie une 500 sur tout le site, y compris la page
 * contact — celle dont on a le plus besoin pendant une panne.
 *
 * Ces valeurs doublent les `@default` de SiteSettings dans prisma/schema.prisma.
 * Prisma ne pouvant pas les exposer cote TypeScript, toute modification du schema
 * doit etre repercutee ici.
 */
export const FALLBACK_SETTINGS: SiteSettings = {
  id: "singleton",
  phone: "0493 / 41 91 26",
  email: "dorian.detailing@gmail.com",
  addressLine: "Grand'Route 550 D2",
  city: "1420 Braine-l'Alleud",
  hours: "Lun - Ven : 9h - 18h\nSam : 9h - 18h\nDim : fermé",
  instagram: null,
  facebook: null,
  tiktok: null,
  googleUrl: "https://maps.google.com/?cid=7597320346183255348",
  googleReviewsUrl:
    "https://search.google.com/local/reviews?placeid=ChIJV7m92q3Nw0cRNMUZP5oab2k",
  googleRating: "5,0",
  googleReviewCount: 140,
  heroTitle: "Votre carrosserie mérite mieux qu'un simple lavage.",
  heroText:
    "Nettoyage, polissage et protection céramique réalisés à la main, dans notre atelier de Braine-l'Alleud. Un rendu sortie-de-concession, à chaque passage.",
  statVehicles: "1 000+",
  statRating: "4.9 / 5",
  boutiqueNote:
    "Ces produits ne sont pas en vente en ligne : contactez-nous par téléphone ou email, ou passez directement à l'atelier.",
  updatedAt: new Date(0),
};
