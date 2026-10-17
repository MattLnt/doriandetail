import { notFound } from "next/navigation";

import { DeleteButton, PageHeader, Panel } from "@/components/admin/ui";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { centsToInput } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { deleteProduct, updateProduct } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditProductPage({ params, searchParams }: PageProps) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productCategory.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!product) notFound();

  const values: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    description: product.description,
    format: product.format,
    brand: product.brand,
    price: centsToInput(product.priceCents),
    imageUrl: product.imageUrl,
    position: product.position,
    published: product.published,
    featured: product.featured,
  };

  const updateAction = updateProduct.bind(null, product.id);

  return (
    <>
      <PageHeader title={product.name} description="Produit de la boutique vitrine." />

      {created && (
        <p
          role="status"
          className="mb-5 rounded-[10px] border border-[rgba(45,122,78,0.3)] bg-[rgba(45,122,78,0.08)] px-4 py-3 text-[13.5px] text-[#2d7a4e]"
        >
          Produit créé.
        </p>
      )}

      <ProductForm
        action={updateAction}
        values={values}
        categories={categories}
        submitLabel="Enregistrer les modifications"
      />

      <div className="mt-6">
        <Panel
          title="Supprimer ce produit"
          description="Pour le retirer temporairement de la boutique, décochez plutôt « Visible dans la boutique »."
        >
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <DeleteButton
              label="Supprimer définitivement"
              confirmMessage={`Supprimer définitivement le produit « ${product.name} » ?`}
            />
          </form>
        </Panel>
      </div>
    </>
  );
}
