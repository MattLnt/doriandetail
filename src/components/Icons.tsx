type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function base({ size = 24, className, strokeWidth = 1.8 }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

export const CarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 13l1.6-5.2A2 2 0 0 1 6.5 6.4h11A2 2 0 0 1 19.4 7.8L21 13" />
    <rect x="2.5" y="13" width="19" height="6" rx="2" />
    <circle cx="7" cy="19" r="1.6" />
    <circle cx="17" cy="19" r="1.6" />
  </svg>
);

export const DropletIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3c3 4 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 2-6 5-10z" />
  </svg>
);

export const SeatIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9" />
    <path d="M4 18h16M8 18v-3a4 4 0 0 1 8 0v3" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2l8 3.2V11c0 5.2-3.4 9-8 10.4C7.4 20 4 16.2 4 11V5.2z" />
    <path d="M9 12l2.2 2.2L15.5 10" />
  </svg>
);

export const ShineIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
  </svg>
);

export const StarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2l3 7h7l-5.6 4.2L18.4 21 12 16.8 5.6 21l2-7.8L2 9h7z" />
  </svg>
);

export const StarFilledIcon = ({ size = 15, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.8 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.8 7.1-.6z" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </svg>
);

export const DocumentIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 19V7a2 2 0 0 1 2-2h8l6 6v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M14 5v5h5" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2.2 })}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const ImageIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 1.5 })}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="10.5" r="1.6" />
    <path d="M21 15l-5.5-4L9 15.5" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2.4 })}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2.2 })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </svg>
);

/** Repere de carte : la fiche Google Business est avant tout un lieu. */
export const GoogleIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <path d="M20 10c0 5.5-8 12-8 12S4 15.5 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const TiktokIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: p.strokeWidth ?? 2 })}>
    <path d="M16 3a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.7V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1V12a2.9 2.9 0 1 0 2 2.8V3z" />
  </svg>
);

/** Icônes sélectionnables depuis le dashboard pour une prestation. */
export const SERVICE_ICONS = {
  droplet: DropletIcon,
  seat: SeatIcon,
  car: CarIcon,
  shield: ShieldIcon,
  sparkle: SparkleIcon,
  shine: ShineIcon,
  star: StarIcon,
  calendar: CalendarIcon,
  document: DocumentIcon,
} as const;

export type ServiceIconName = keyof typeof SERVICE_ICONS;

export const SERVICE_ICON_LABELS: Record<ServiceIconName, string> = {
  droplet: "Goutte (lavage)",
  seat: "Siège (intérieur)",
  car: "Voiture (extérieur)",
  shield: "Bouclier (protection)",
  sparkle: "Étoile scintillante (céramique)",
  shine: "Éclat (polissage)",
  star: "Étoile (premium)",
  calendar: "Calendrier (abonnement)",
  document: "Document (devis)",
};

export function ServiceIcon({
  name,
  size = 26,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = SERVICE_ICONS[name as ServiceIconName] ?? SparkleIcon;
  return <Component size={size} className={className} />;
}
