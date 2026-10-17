"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ImageIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string | null;
  format: string | null;
  priceCents: number;
  imageUrl: string | null;
  brand: string | null;
  featured: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
};

const ALL = "all";

export function ShopGrid({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [active, setActive] = useState<string>(ALL);

  const visible = useMemo(
    () => (active === ALL ? products : products.filter((p) => p.categoryId === active)),
    [active, products],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filtrer par rayon">
        <FilterChip
          label="Tous les produits"
          active={active === ALL}
          onClick={() => setActive(ALL)}
        />
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            label={category.name}
            active={active === category.id}
            onClick={() => setActive(category.id)}
          />
        ))}
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <article key={product.id} className="card flex flex-col overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F2EEEA] to-[#E6E0D9]">
              {product.imageUrl ? (
                // Image non optimisée : les visuels produits sont servis depuis /public
                // ou une URL externe fournie dans le dashboard.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
                  <ImageIcon size={34} />
                </div>
              )}
              {product.featured && (
                <span className="badge badge-accent absolute left-3 top-3">
                  Recommandé
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              {product.category && (
                <p className="text-[11.5px] font-semibold uppercase tracking-wider text-accent">
                  {product.category.name}
                </p>
              )}
              <h3 className="mt-2 text-[15px] font-semibold leading-snug">
                {product.name}
              </h3>
              {product.brand && (
                <p className="mt-1 text-[12.5px] text-ink-faint">{product.brand}</p>
              )}
              {product.description && (
                <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
                  {product.description}
                  {product.format ? ` ${product.format}.` : ""}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <span className="disp text-[16px] font-bold">
                  {formatPrice(product.priceCents)}
                </span>
                <Link
                  href={`/contact?produit=${encodeURIComponent(product.name)}`}
                  className="text-[13px] font-semibold text-accent"
                >
                  Demander →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-9 text-[14.5px] text-ink-faint">
          Aucun produit dans ce rayon pour le moment.
        </p>
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink-dim hover:border-accent/50"
      }`}
    >
      {label}
    </button>
  );
}
