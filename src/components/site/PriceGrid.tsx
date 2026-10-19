import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { PublicService, VehicleClass } from "@/lib/queries";

/**
 * Grille tarifaire complete.
 *
 * Deux rendus pour la meme donnee : un tableau a partir de `md`, et un
 * accordeon en dessous. Le tableau compte autant de colonnes que de gabarits
 * — cinq aujourd'hui — et reclamait un min-width de 720 px, donc un
 * defilement horizontal sur telephone, ce qu'un client a signale.
 *
 * L'accordeon utilise <details>, qui ouvre et ferme sans JavaScript et reste
 * annonce correctement par les lecteurs d'ecran. Replie par defaut : onze
 * prestations deployees feraient une page interminable.
 */

function priceCell(
  service: PublicService,
  price: PublicService["prices"][number] | undefined,
) {
  const amount = price?.promoCents ?? price?.priceCents ?? null;
  const hasPromo =
    price?.promoCents !== null &&
    price?.promoCents !== undefined &&
    price?.priceCents !== null;

  if (service.quoteOnly || amount === null) {
    return <span className="text-[13px] text-ink-faint">Sur devis</span>;
  }
  if (hasPromo) {
    return (
      <span className="inline-flex items-baseline gap-2 md:flex-col md:items-end md:gap-0">
        <span className="text-[12px] text-ink-faint line-through">
          {formatPrice(price!.priceCents)}
        </span>
        <span className="disp text-[14.5px] font-bold text-accent-deep">
          {formatPrice(amount)}
        </span>
      </span>
    );
  }
  return <span className="disp text-[14.5px] font-bold">{formatPrice(amount)}</span>;
}

/** Le plus bas des tarifs publies, pour l'afficher sur l'entete replie. */
function startingFrom(service: PublicService) {
  const amounts = service.prices
    .map((price) => price.promoCents ?? price.priceCents)
    .filter((amount): amount is number => amount !== null);
  return amounts.length > 0 ? Math.min(...amounts) : null;
}

export function PriceGrid({
  services,
  vehicleClasses,
}: {
  services: PublicService[];
  vehicleClasses: VehicleClass[];
}) {
  return (
    <>
      {/* ── Telephone : un panneau depliable par prestation ───────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {services.map((service) => {
          const byVehicle = new Map(
            service.prices.map((price) => [price.vehicleClassId, price]),
          );
          const from = startingFrom(service);

          return (
            <details
              key={service.id}
              className="card group overflow-hidden [&[open]_.chevron]:-rotate-180"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold leading-snug">
                    {service.name}
                  </span>
                  {service.group && (
                    <span className="mt-0.5 block text-[12px] text-ink-faint">
                      {service.group.name}
                    </span>
                  )}
                </span>
                <span className="flex flex-shrink-0 items-center gap-2.5">
                  <span className="disp text-[14px] font-bold text-accent-deep">
                    {service.quoteOnly || from === null
                      ? "Sur devis"
                      : `dès ${formatPrice(from)}`}
                  </span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="chevron text-ink-faint transition-transform duration-150"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <dl className="border-t border-line px-5 py-1.5">
                {vehicleClasses.map((vehicleClass) => (
                  <div
                    key={vehicleClass.id}
                    className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0"
                  >
                    <dt className="text-[13.5px] text-ink-dim">{vehicleClass.name}</dt>
                    <dd className="text-right">
                      {priceCell(service, byVehicle.get(vehicleClass.id))}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-line px-5 py-3">
                <Link
                  href={`/prestations/${service.slug}`}
                  className="text-[13px] font-semibold text-accent-deep"
                >
                  Voir le détail de la prestation →
                </Link>
              </div>
            </details>
          );
        })}
      </div>

      {/* ── A partir de md : le tableau ───────────────────────────────────── */}
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Tarifs de chaque prestation selon le gabarit du véhicule
          </caption>
          <thead>
            <tr className="border-b border-line bg-surface-2">
              <th
                scope="col"
                className="px-5 py-4 text-[12px] font-semibold uppercase tracking-wider text-ink-dim"
              >
                Prestation
              </th>
              {vehicleClasses.map((vehicleClass) => (
                <th
                  key={vehicleClass.id}
                  scope="col"
                  className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-wider text-ink-dim"
                >
                  {vehicleClass.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const byVehicle = new Map(
                service.prices.map((price) => [price.vehicleClassId, price]),
              );
              return (
                <tr key={service.id} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-4 align-top">
                    <Link
                      href={`/prestations/${service.slug}`}
                      className="text-[14px] font-semibold hover:text-accent-deep"
                    >
                      {service.name}
                    </Link>
                    {service.group && (
                      <span className="mt-1 block text-[12px] font-normal text-ink-faint">
                        {service.group.name}
                      </span>
                    )}
                  </th>
                  {vehicleClasses.map((vehicleClass) => (
                    <td
                      key={vehicleClass.id}
                      className="whitespace-nowrap px-5 py-4 text-right align-top"
                    >
                      {priceCell(service, byVehicle.get(vehicleClass.id))}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
