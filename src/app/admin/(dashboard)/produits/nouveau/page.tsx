import { PageHeader } from "@/components/admin/ui";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  const [categories, count] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { position: "asc" } }),
    prisma.product.count(),
  ]);

  const values: ProductFormValues = {
    name: "",
    slug: "",
    categoryId: null,
    description: null,
    format: null,
    brand: null,
    price: "",
    imageUrl: null,
    position: count,
    published: true,
    featured: false,
  };

  return (
    <>
      <PageHeader title="Nouveau produit" />
      <ProductForm
        action={createProduct}
        values={values}
        categories={categories}
        submitLabel="Créer le produit"
      />
    </>
  );
}
