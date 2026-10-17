import { DeleteButton, PageHeader, Panel, SubmitButton } from "@/components/admin/ui";
import { NewCategoryForm } from "@/components/admin/NewCategoryForm";
import { prisma } from "@/lib/prisma";

import { deleteCategory, updateCategory } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Rayons boutique" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <PageHeader
        title="Rayons boutique"
        description="Les rayons servent de filtres sur la page Boutique. Seuls ceux contenant au moins un produit publié y apparaissent."
      />

      <div className="flex flex-col gap-4">
        <NewCategoryForm nextPosition={categories.length} />

        {categories.map((category) => (
          <Panel key={category.id}>
            <form action={updateCategory} className="flex flex-wrap items-end gap-4">
              <input type="hidden" name="id" value={category.id} />

              <div className="min-w-[220px] flex-1">
                <label htmlFor={`cat-name-${category.id}`} className="label">
                  Nom du rayon
                </label>
                <input
                  id={`cat-name-${category.id}`}
                  name="name"
                  className="field"
                  defaultValue={category.name}
                  required
                />
              </div>

              <div className="w-[100px]">
                <label htmlFor={`cat-position-${category.id}`} className="label">
                  Ordre
                </label>
                <input
                  id={`cat-position-${category.id}`}
                  name="position"
                  type="number"
                  className="field"
                  defaultValue={category.position}
                />
              </div>

              <SubmitButton label="Enregistrer" className="btn btn-primary btn-sm" />
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <span className="text-[12.5px] text-ink-faint">
                {category._count.products === 0
                  ? "Aucun produit dans ce rayon"
                  : `${category._count.products} produit${
                      category._count.products > 1 ? "s" : ""
                    }`}
              </span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <DeleteButton
                  label="Supprimer le rayon"
                  confirmMessage={`Supprimer le rayon « ${category.name} » ? Ses ${category._count.products} produit(s) sont conservés mais se retrouvent sans rayon.`}
                />
              </form>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
