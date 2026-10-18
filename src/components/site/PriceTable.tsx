import { formatPrice } from "@/lib/format";
import type { PublicService } from "@/lib/queries";

/** Grille tarifaire d'une prestation, un prix par gabarit. */
export function PriceTable({ service }: { service: PublicService }) {
  if (service.quoteOnly) {
    return (
      <div className="card p-6">
        <p className="disp text-[19px] font-bold">Sur devis</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
          Cette prestation nécessite une inspection préalable du véhicule. Contactez-nous
          pour convenir d&apos;un passage à l&apos;atelier et recevoir un devis
          personnalisé.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Tarifs de la prestation {service.name} par gabarit de véhicule
        </caption>
        <thead>
          <tr className="border-b border-line bg-surface-2">
            <th
              scope="col"
              className="px-5 py-3 text-[12px] font-semibold uppercase tracking-wider text-ink-dim"
            >
              Gabarit
            </th>
            <th
              scope="col"
              className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-ink-dim"
            >
              Tarif
            </th>
          </tr>
        </thead>
        <tbody>
          {service.prices.map((price) => (
            <tr key={price.id} className="border-b border-line last:border-0">
              <th scope="row" className="px-5 py-3.5 text-sm font-medium">
                {price.vehicleClass.name}
              </th>
              <td className="px-5 py-3.5 text-right">
                {price.promoCents !== null && price.priceCents !== null ? (
                  <span className="flex items-center justify-end gap-2.5">
                    <span className="text-[13px] text-ink-faint line-through">
                      {formatPrice(price.priceCents)}
                    </span>
                    <span className="disp text-[15.5px] font-bold text-accent-deep">
                      {formatPrice(price.promoCents)}
                    </span>
                    <span className="badge badge-accent">Promo</span>
                  </span>
                ) : (
                  <span className="disp text-[15.5px] font-bold">
                    {formatPrice(price.promoCents ?? price.priceCents)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
