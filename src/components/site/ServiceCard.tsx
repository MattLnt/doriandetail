import Link from "next/link";

import { ServiceIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { startingPrice, type PublicService } from "@/lib/queries";

export function ServiceCard({ service }: { service: PublicService }) {
  const from = startingPrice(service);

  const dark = service.featured;

  return (
    <Link
      href={`/prestations/${service.slug}`}
      className={`group flex flex-col p-6 transition-colors ${
        dark
          ? "card-dark border-accent/40 hover:border-accent"
          : "card hover:border-accent/50"
      }`}
    >
      <span className={dark ? "text-accent" : "text-accent-deep"}>
        <ServiceIcon name={service.icon} size={26} />
      </span>

      {service.badge && (
        <span className="badge badge-accent mt-4 self-start">{service.badge}</span>
      )}

      <h3 className="mt-4 text-[16.5px] font-semibold leading-snug">{service.name}</h3>
      <p
        className={`mt-2 line-clamp-3 text-[13.5px] leading-relaxed ${
          dark ? "text-on-dark-dim" : "text-ink-dim"
        }`}
      >
        {service.tagline}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <span className="disp text-[19px] font-bold">
          {from === null ? "Sur devis" : `dès ${formatPrice(from)}`}
        </span>
        <span
          className={`text-[13px] font-semibold transition-transform group-hover:translate-x-0.5 ${
            dark ? "text-accent" : "text-accent-deep"
          }`}
        >
          En savoir plus →
        </span>
      </div>
    </Link>
  );
}
