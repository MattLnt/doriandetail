import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/admin/ui";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ImageIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { toggleProductPublished } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Produits" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { category: { select: { name: true } } },
  });

  return (
    <>
      <PageHeader
        title="Produits"
        description="La boutique est une vitrine : les prix sont indicatifs et aucune commande n'est possible en ligne. Les clients vous contactent ou passent à l'atelier."
        action={{ href: "/admin/produits/nouveau", label: "Nouveau produit" }}
      />

      {products.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          description="Ajoutez les références que vous utilisez et recommandez en atelier."
          action={{ href: "/admin/produits/nouveau", label: "Nouveau produit" }}
        />
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-line bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th
                  scope="col"
                  className="px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint"
                >
                  Produit
                </th>
                <th
                  scope="col"
                  className="hidden px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint md:table-cell"
                >
                  Rayon
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint"
                >
                  Prix
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint"
                >
                  État
                </th>
                <th scope="col" className="px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-line bg-surface-2 text-ink-faint">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={18} />
                        )}
                      </span>
                      <span className="min-w-0">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="block text-[14px] font-semibold hover:text-accent"
                        >
                          {product.name}
                        </Link>
                        {product.format && (
                          <span className="block text-[12px] text-ink-faint">
                            {product.format}
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-[13px] text-ink-dim md:table-cell">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[13.5px] font-semibold">
                    {formatPrice(product.priceCents)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${product.published ? "badge-on" : "badge-off"}`}>
                      {product.published ? "En ligne" : "Masqué"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <form action={toggleProductPublished} className="inline">
                      <input type="hidden" name="id" value={product.id} />
                      <PublishToggle published={product.published} />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
