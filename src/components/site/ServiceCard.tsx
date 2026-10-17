import Link from "next/link";

import { ServiceIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { startingPrice, type PublicService } from "@/lib/queries";

export function ServiceCard({ service }: { service: PublicService }) {
  const from = startingPrice(service);

  return (
    <Link
      href={`/prestations/${service.slug}`}
      className={`card group flex flex-col p-6 transition-colors hover:border-accent/50 ${
        service.featured ? "border-accent/35 bg-gradient-to-br from-accent-soft to-surface" : ""
      }`}
    >
      <span className="text-accent">
        <ServiceIcon name={service.icon} size={26} />
      </span>

      {service.badge && (
        <span className="badge badge-accent mt-4 self-start">{service.badge}</span>
      )}

      <h3 className="mt-4 text-[16.5px] font-semibold leading-snug">{service.name}</h3>
      <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-dim">
        {service.tagline}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <span className="disp text-[19px] font-bold">
          {from === null ? "Sur devis" : `dès ${formatPrice(from)}`}
        </span>
        <span className="text-[13px] font-semibold text-accent transition-transform group-hover:translate-x-0.5">
          En savoir plus →
        </span>
      </div>
    </Link>
  );
}
