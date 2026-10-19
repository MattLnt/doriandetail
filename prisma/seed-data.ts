/**
 * Données initiales — extraites de « Elite Detail.xlsx » (onglet Dorian Detail)
 * et de « PRESTATION DORIAN DETAILING.pdf ».
 * Tous les prix sont exprimés en euros ; le seed les convertit en centimes.
 */

export const VEHICLE_CLASSES = [
  { name: "Citadine", slug: "citadine" },
  { name: "Berline / Break", slug: "berline-break" },
  { name: "SUV", slug: "suv" },
  { name: "7 places / Pick-up", slug: "7-places-pick-up" },
  { name: "Sportive", slug: "sportive" },
] as const;

export type VehicleSlug = (typeof VEHICLE_CLASSES)[number]["slug"];

export const OPTIONS = [
  {
    slug: "shampoing-sieges-cuir",
    name: "Shampoing sièges + nettoyage et traitement du cuir",
    price: 80,
    description:
      "Injection / extraction des sièges, puis nettoyage et nourrissage des surfaces cuir.",
  },
  {
    slug: "ceramique-spray-6-mois",
    name: "Céramique spray 6 mois",
    price: 20,
    description: "Protection hydrophobe rapide, tenue d'environ 6 mois.",
  },
  {
    slug: "nettoyage-ciel-de-toit",
    name: "Nettoyage du ciel de toit",
    price: 70,
    description: "Traitement délicat du ciel de toit, taches et auréoles.",
  },
  {
    slug: "shampoing-coffre",
    name: "Shampoing coffre",
    price: 30,
    description: "Shampoing de la moquette et des parois du coffre.",
  },
  {
    slug: "traitement-hydrophobe-vitres",
    name: "Traitement hydrophobe vitres et pare-brise 12 mois",
    price: 55,
    description:
      "L'eau perle et s'évacue seule : visibilité nettement améliorée sous la pluie.",
  },
  {
    slug: "remplissage-lave-glace",
    name: "Remplissage du liquide lave-glace",
    price: 7,
    description: null,
  },
  {
    slug: "pression-pneus",
    name: "Vérification et remise à la pression optimale de vos pneus",
    price: 7,
    description: null,
  },
  {
    slug: "nettoyage-moteur",
    name: "Nettoyage moteur + rénovateur plastiques",
    price: 70,
    description: "Dégraissage du compartiment moteur et remise en teinte des plastiques.",
  },
  {
    slug: "traitement-ozone",
    name: "Traitement ozone",
    price: 60,
    description: "Élimine les odeurs persistantes (tabac, animaux, humidité) à la source.",
  },
  {
    slug: "ceramique-12-mois",
    name: "Céramique 12 mois",
    price: 100,
    description: "Sealant céramique longue durée, brillance et protection renforcées.",
  },
] as const;

export type OptionSlug = (typeof OPTIONS)[number]["slug"];

export const SERVICE_GROUPS = [
  { name: "Nettoyage & reconditionnement", slug: "nettoyage-reconditionnement" },
  { name: "Traitement céramique", slug: "traitement-ceramique" },
  { name: "Polissage", slug: "polissage" },
  { name: "Abonnement", slug: "abonnement" },
] as const;

type GroupSlug = (typeof SERVICE_GROUPS)[number]["slug"];

export type ServiceSeed = {
  slug: string;
  name: string;
  group: GroupSlug;
  icon: string;
  tagline: string;
  badge?: string;
  featured?: boolean;
  quoteOnly?: boolean;
  description?: string;
  inclusions: string[];
  /** Prix par gabarit, en euros. null = sur devis */
  prices: Record<VehicleSlug, number | null>;
  /** Prix promotionnels par gabarit, en euros */
  promos?: Partial<Record<VehicleSlug, number>>;
  /** Options proposées en supplément */
  options: OptionSlug[];
};

const ALL_OPTION_SLUGS = OPTIONS.map((o) => o.slug) as OptionSlug[];

export const SERVICES: ServiceSeed[] = [
  {
    slug: "formule-essentielle",
    name: "Formule essentielle",
    group: "nettoyage-reconditionnement",
    icon: "droplet",
    tagline:
      "Idéale pour les véhicules régulièrement entretenus, nécessitant un nettoyage intérieur et extérieur pour retrouver propreté et fraîcheur.",
    inclusions: [
      "Pré-lavage à la mousse active",
      "Lavage complet de la carrosserie",
      "Nettoyage des jantes intérieur et face externe / passages de roues / pneus",
      "Nettoyage des passages de portes",
      "Séchage complet",
      "Application d'une cire 4-8 semaines",
      "Brillant pneu",
      "Aspiration de l'habitacle",
      "Nettoyage des plastiques",
      "Shampoing des tapis",
      "Nettoyage des rails de sièges",
      "Nettoyage du volant",
      "Nettoyage des pédales",
      "Nettoyage des vitres intérieures et extérieures",
    ],
    prices: {
      citadine: 110,
      "berline-break": 130,
      suv: 155,
      "7-places-pick-up": 155,
      sportive: 130,
    },
    options: [
      "shampoing-sieges-cuir",
      "ceramique-spray-6-mois",
      "nettoyage-ciel-de-toit",
      "shampoing-coffre",
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
      "traitement-ozone",
    ],
  },
  {
    slug: "reconditionnement-interieur",
    name: "Reconditionnement intérieur",
    group: "nettoyage-reconditionnement",
    icon: "seat",
    tagline:
      "Idéal pour les véhicules n'ayant pas été entretenus depuis un certain temps et nécessitant une attention particulière, avec un nettoyage complet et approfondi de l'habitacle.",
    inclusions: [
      "Aspiration approfondie de l'habitacle",
      "Nettoyage et brillance des plastiques",
      "Nettoyage au pinceau dans les moindres recoins",
      "Nettoyage des vitres intérieures",
      "Désinfection à la vapeur de l'habitacle",
      "Shampoing du coffre",
      "Shampoing tapis et moquettes",
      "Nettoyage et traitement du cuir",
      "Nettoyage des grilles d'aération",
      "Nettoyage console centrale",
      "Nettoyage des rails de sièges",
      "Traitement ozone (si besoin)",
      "Désinfection du système d'aération",
    ],
    prices: {
      citadine: 150,
      "berline-break": 170,
      suv: 195,
      "7-places-pick-up": 210,
      sportive: 160,
    },
    options: [
      "shampoing-sieges-cuir",
      "nettoyage-ciel-de-toit",
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
    ],
  },
  {
    slug: "detailing-exterieur",
    name: "Detailing extérieur",
    group: "nettoyage-reconditionnement",
    icon: "car",
    tagline:
      "Un nettoyage complet et approfondi de l'extérieur du véhicule, idéal pour redonner à votre carrosserie toute sa brillance, sa douceur et son éclat.",
    inclusions: [
      "Pré-lavage à la mousse active",
      "Lavage manuel complet de la carrosserie",
      "Nettoyage approfondi des jantes",
      "Nettoyage des passages de roues",
      "Nettoyage des pneus",
      "Dégraissage et décontamination des jantes",
      "Décontamination chimique de la carrosserie",
      "Élimination des traces de goudron et résidus incrustés",
      "Nettoyage des grilles, emblèmes et recoins",
      "Nettoyage des contours de portes",
      "Nettoyage de la trappe à carburant",
      "Nettoyage des vitres extérieures",
      "Séchage minutieux de la carrosserie",
      "Application d'un dressing sur les pneus",
      "Ravivage des plastiques extérieurs",
      "Application d'une cire de protection (4-8 semaines)",
      "Finition brillante de la carrosserie",
    ],
    prices: {
      citadine: 110,
      "berline-break": 130,
      suv: 150,
      "7-places-pick-up": 155,
      sportive: 110,
    },
    options: [
      "shampoing-sieges-cuir",
      "ceramique-spray-6-mois",
      "nettoyage-ciel-de-toit",
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
      "traitement-ozone",
    ],
  },
  {
    slug: "reconditionnement-integral",
    name: "Reconditionnement intégral",
    group: "nettoyage-reconditionnement",
    icon: "shield",
    badge: "Le plus réservé",
    featured: true,
    tagline:
      "Un nettoyage complet et approfondi de l'intérieur et de l'extérieur pour retrouver un véhicule dans un état de propreté optimal. Idéal pour une restitution de leasing.",
    inclusions: [
      "Pré-lavage à la mousse active",
      "Lavage en profondeur de la carrosserie",
      "Nettoyage en profondeur des jantes, passages de roues et pneus",
      "Nettoyage des intérieurs de portes et montants",
      "Décontamination chimique (Iron X)",
      "Nettoyage trappe à carburant",
      "Nettoyage du moteur + application d'un rénovateur plastique",
      "Polissage pot d'échappement",
      "Application d'un sealant céramique (4-8 semaines)",
      "Aspiration complète de l'habitacle et du coffre",
      "Nettoyage et brillance des plastiques",
      "Nettoyage des pédales",
      "Nettoyage du volant",
      "Nettoyage au pinceau dans les moindres recoins",
      "Nettoyage des vitres intérieures et extérieures",
      "Shampoing du coffre",
      "Shampoing des sièges + appuis-têtes",
      "Shampoing tapis et moquettes",
      "Nettoyage et traitement du cuir",
      "Nettoyage des grilles d'aération",
      "Nettoyage des rails de sièges",
      "Désinfection à la vapeur de l'habitacle",
      "Désinfection du système d'aération",
      "Traitement à l'ozone (si besoin)",
    ],
    prices: {
      citadine: 300,
      "berline-break": 330,
      suv: 360,
      "7-places-pick-up": 410,
      sportive: 300,
    },
    options: [
      "ceramique-spray-6-mois",
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
    ],
  },
  {
    slug: "shampoing-des-sieges",
    name: "Shampoing des sièges",
    group: "nettoyage-reconditionnement",
    icon: "seat",
    tagline:
      "Shampoing des sièges et appuis-têtes par injection / extraction et/ou vapeur. Taches, odeurs et saleté incrustée éliminées en profondeur.",
    inclusions: [
      "Shampoing des sièges par injection / extraction",
      "Traitement vapeur des zones incrustées",
      "Shampoing des appuis-têtes",
      "Séchage et aération de l'habitacle",
    ],
    prices: {
      citadine: 90,
      "berline-break": 90,
      suv: 90,
      "7-places-pick-up": 120,
      sportive: 90,
    },
    options: [
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
      "traitement-ozone",
    ],
  },
  {
    slug: "renovation-esthetique-complete",
    name: "Rénovation esthétique complète",
    group: "nettoyage-reconditionnement",
    icon: "star",
    featured: true,
    tagline:
      "Offrez une seconde jeunesse à votre véhicule grâce à un nettoyage complet de l'intérieur et de l'extérieur, associé à un polissage de la carrosserie pour raviver sa brillance, atténuer les micro-rayures et lui redonner tout son éclat.",
    inclusions: [
      "Tout ce qui est inclus dans la formule « Reconditionnement intégral »",
      "Polissage en une étape sur l'entièreté de la carrosserie",
      "Application d'un sealant céramique 6 mois (upgrade céramique 12 mois possible)",
      "Vérification et remise à la pression optimale de vos pneus",
    ],
    prices: {
      citadine: 570,
      "berline-break": 650,
      suv: 725,
      "7-places-pick-up": 750,
      sportive: 650,
    },
    options: [
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
      "ceramique-12-mois",
    ],
  },
  {
    slug: "one-step-ceramique-3-5-ans",
    name: "Formule one-step + céramique 3-5 ans",
    group: "traitement-ceramique",
    icon: "sparkle",
    badge: "Meilleure plus-value",
    featured: true,
    tagline:
      "Idéal pour raviver l'éclat de votre carrosserie et la protéger durablement. Pour préserver cette protection, privilégiez notre formule abonnement avec un entretien toutes les 6 semaines.",
    description:
      "La durée de protection dépend de l'entretien et des conditions d'utilisation du véhicule.",
    inclusions: [
      "Nettoyage complet extérieur",
      "Nettoyage approfondi des jantes",
      "Décontamination chimique à l'Iron X",
      "Décontamination mécanique à la clay bar",
      "Séchage minutieux du véhicule",
      "Polissage One Step (une étape de correction)",
      "Atténuation des micro-rayures et des défauts légers",
      "Amélioration de la brillance et de la profondeur de la peinture",
      "Dégraissage complet de la carrosserie à l'IPA",
      "Application de deux couches de traitement céramique",
      "Protection céramique de 3 à 5 ans (plastiques & carrosserie)",
      "Brillant pneu",
      "Finition et contrôle qualité",
    ],
    prices: {
      citadine: 900,
      "berline-break": 990,
      suv: 1150,
      "7-places-pick-up": 1300,
      sportive: 990,
    },
    promos: {
      citadine: 800,
      "berline-break": 900,
      suv: 1040,
      "7-places-pick-up": 1200,
      sportive: 800,
    },
    options: [
      "shampoing-sieges-cuir",
      "nettoyage-ciel-de-toit",
      "shampoing-coffre",
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
      "traitement-ozone",
    ],
  },
  {
    slug: "correction-integrale-ceramique-3-5-ans",
    name: "Formule correction intégrale + céramique 3-5 ans",
    group: "traitement-ceramique",
    icon: "shield",
    quoteOnly: true,
    tagline:
      "Idéale pour les carrosseries présentant des défauts importants, cette formule associe un polissage en plusieurs étapes à une protection céramique longue durée. Une inspection préalable du véhicule est nécessaire pour établir un devis personnalisé.",
    inclusions: [
      "Nettoyage complet extérieur",
      "Nettoyage approfondi des jantes",
      "Décontamination chimique à l'Iron X",
      "Décontamination mécanique à la clay bar",
      "Séchage minutieux du véhicule",
      "Polissage en plusieurs étapes (HARD, MEDIUM, FINITION)",
      "Atténuation des micro-rayures et des défauts plus importants",
      "Amélioration de la brillance et de la profondeur de la peinture",
      "Dégraissage complet de la carrosserie à l'IPA",
      "Application de deux couches de traitement céramique",
      "Protection céramique de 3 à 5 ans (plastiques & carrosserie)",
      "Brillant pneu",
      "Finition et contrôle qualité",
    ],
    prices: {
      citadine: null,
      "berline-break": null,
      suv: null,
      "7-places-pick-up": null,
      sportive: null,
    },
    options: [],
  },
  {
    slug: "polissage",
    name: "Polissage",
    group: "polissage",
    icon: "shine",
    tagline:
      "Idéal pour redonner éclat, brillance et profondeur à votre carrosserie tout en atténuant les micro-rayures et les défauts légers. Pour les imperfections plus importantes, un polissage en plusieurs étapes est recommandé.",
    inclusions: [
      "Nettoyage complet extérieur",
      "Nettoyage approfondi des jantes",
      "Décontamination chimique à l'Iron X",
      "Décontamination mécanique à la clay bar",
      "Séchage minutieux du véhicule",
      "Polissage One Step (une étape de correction)",
      "Atténuation des micro-rayures et des défauts légers",
      "Amélioration de la brillance et de la profondeur de la peinture",
      "Dégraissage complet de la carrosserie à l'IPA",
      "Application d'un sealant céramique 6 mois (upgrade céramique 12 mois possible)",
      "Rénovateur plastiques extérieurs",
      "Brillant pneu",
      "Finition et contrôle qualité",
    ],
    prices: {
      citadine: 490,
      "berline-break": 550,
      suv: 600,
      "7-places-pick-up": 650,
      sportive: 550,
    },
    options: [
      "shampoing-sieges-cuir",
      "nettoyage-ciel-de-toit",
      "traitement-hydrophobe-vitres",
      "remplissage-lave-glace",
      "pression-pneus",
      "nettoyage-moteur",
      "traitement-ozone",
      "ceramique-12-mois",
    ],
  },
  {
    slug: "polissage-multi-passes",
    name: "Polissage multi-passes",
    group: "polissage",
    icon: "shine",
    quoteOnly: true,
    tagline:
      "Idéal pour les carrosseries présentant des défauts importants, ce polissage en plusieurs étapes permet de corriger les imperfections les plus marquées, d'atténuer les rayures profondes et de redonner à votre peinture tout son éclat et sa profondeur.",
    inclusions: [
      "Nettoyage complet extérieur",
      "Nettoyage approfondi des jantes",
      "Décontamination chimique à l'Iron X",
      "Décontamination mécanique à la clay bar",
      "Séchage minutieux du véhicule",
      "Polissage en plusieurs étapes (HARD, MEDIUM, FINITION)",
      "Correction des micro-rayures et des plus gros défauts",
      "Amélioration de la brillance et de la profondeur de la peinture",
      "Dégraissage complet de la carrosserie à l'IPA",
      "Application d'un sealant céramique 6 mois (upgrade céramique 12 mois possible)",
      "Rénovateur plastiques extérieurs",
      "Brillant pneu",
      "Finition et contrôle qualité",
    ],
    prices: {
      citadine: null,
      "berline-break": null,
      suv: null,
      "7-places-pick-up": null,
      sportive: null,
    },
    options: [],
  },
  {
    slug: "abonnement-premium",
    name: "Formule abonnement Premium",
    group: "abonnement",
    icon: "calendar",
    tagline:
      "La solution idéale pour conserver un véhicule impeccable toute l'année ! Profitez d'un entretien intérieur et extérieur toutes les 6 semaines pour préserver sa propreté, sa brillance et ses protections.",
    description: "Tarif par passage, entretien programmé toutes les 6 semaines.",
    inclusions: [
      "Pré-lavage à la mousse active",
      "Lavage complet de la carrosserie",
      "Nettoyage des jantes intérieur et face externe / passages de roues / pneus",
      "Nettoyage des passages de portes",
      "Séchage complet",
      "Application d'une cire 4-8 semaines",
      "Brillant pneu",
      "Aspiration de l'habitacle",
      "Nettoyage des plastiques",
      "Shampoing des tapis",
      "Nettoyage des rails de sièges",
      "Nettoyage du volant",
      "Nettoyage des pédales",
      "Nettoyage des vitres intérieures et extérieures",
    ],
    prices: {
      citadine: 100,
      "berline-break": 110,
      suv: 120,
      "7-places-pick-up": 130,
      sportive: 110,
    },
    options: ALL_OPTION_SLUGS,
  },
];

export const PRODUCT_CATEGORIES = [
  { name: "Pré-lavage / Lavage", slug: "pre-lavage-lavage" },
  { name: "Jantes & pneus", slug: "jantes-pneus" },
  { name: "Décontamination", slug: "decontamination" },
  { name: "Polissage", slug: "polissage-produits" },
  { name: "Protection & cire", slug: "protection-cire" },
  { name: "Intérieur", slug: "interieur" },
  { name: "Vitres & phares", slug: "vitres-phares" },
  { name: "Accessoires", slug: "accessoires" },
] as const;

export const PRODUCTS = [
  {
    slug: "shampoing-lavage-premium",
    name: "Shampoing lavage premium",
    category: "pre-lavage-lavage",
    description: "Formule pH neutre haute lubrification.",
    format: "500 ml",
    price: 17.9,
    featured: true,
  },
  {
    slug: "nettoyant-jantes-acid-free",
    name: "Nettoyant jantes acid-free",
    category: "jantes-pneus",
    description: "Dissout la poussière de frein sans attaquer les revêtements.",
    format: "1 L",
    price: 15.5,
    featured: false,
  },
  {
    slug: "clay-bar-lubrifiant",
    name: "Clay bar + lubrifiant",
    category: "decontamination",
    description: "Kit décontamination carrosserie avant polish.",
    format: "Barre 100 g",
    price: 24.9,
    featured: false,
  },
  {
    slug: "polish-correcteur-micro-rayures",
    name: "Polish correcteur micro-rayures",
    category: "polissage-produits",
    description: "Abrasif fin, correction légère à la machine ou à la main.",
    format: "250 ml",
    price: 29.9,
    featured: false,
  },
  {
    slug: "cire-synthetique-longue-duree",
    name: "Cire synthétique longue durée",
    category: "protection-cire",
    description: "Brillance et effet hydrophobe jusqu'à 6 mois.",
    format: "Pot 200 ml",
    price: 34.9,
    featured: true,
  },
  {
    slug: "nettoyant-multi-usage",
    name: "Nettoyant multi-usage",
    category: "interieur",
    description: "Plastiques, tissus et surfaces intérieures.",
    format: "500 ml",
    price: 14.9,
    featured: false,
  },
  {
    slug: "nettoyant-vitres-anti-traces",
    name: "Nettoyant vitres anti-traces",
    category: "vitres-phares",
    description: "Formule sans ammoniaque, sans trace.",
    format: "500 ml",
    price: 12.5,
    featured: false,
  },
  {
    slug: "kit-microfibres-premium",
    name: "Kit microfibres premium",
    category: "accessoires",
    description: "Lot de 4 microfibres, usages séchage / polish / vitres / intérieur.",
    format: "Lot de 4",
    price: 19.9,
    featured: false,
  },
] as const;
