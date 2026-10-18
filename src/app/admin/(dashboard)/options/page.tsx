import { DeleteButton, PageHeader, Panel, SubmitButton } from "@/components/admin/ui";
import { NewOptionForm } from "@/components/admin/NewOptionForm";
import { centsToInput } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { deleteOption, updateOption } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Options" };

export default async function AdminOptionsPage() {
  const options = await prisma.option.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { services: true } } },
  });

  return (
    <>
      <PageHeader
        title="Options"
        description="Suppléments facturables en plus d'une prestation. Une fois créée, une option s'attache aux prestations concernées depuis leur fiche."
      />

      <div className="flex flex-col gap-5">
        <NewOptionForm nextPosition={options.length} />

        {options.map((option) => (
          <Panel key={option.id}>
            <form action={updateOption} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={option.id} />

              <div className="grid gap-4 md:grid-cols-[1fr_130px_110px]">
                <div>
                  <label htmlFor={`name-${option.id}`} className="label">
                    Nom
                  </label>
                  <input
                    id={`name-${option.id}`}
                    name="name"
                    className="field"
                    defaultValue={option.name}
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`price-${option.id}`} className="label">
                    Prix (€)
                  </label>
                  <input
                    id={`price-${option.id}`}
                    name="price"
                    className="field"
                    inputMode="decimal"
                    defaultValue={centsToInput(option.priceCents)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`position-${option.id}`} className="label">
                    Ordre
                  </label>
                  <input
                    id={`position-${option.id}`}
                    name="position"
                    type="number"
                    className="field"
                    defaultValue={option.position}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`description-${option.id}`} className="label">
                  Description
                </label>
                <input
                  id={`description-${option.id}`}
                  name="description"
                  className="field"
                  defaultValue={option.description ?? ""}
                  placeholder="Optionnel"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                <div className="flex flex-wrap items-center gap-5">
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={option.published}
                      className="h-4 w-4 accent-[#A6543D]"
                    />
                    <span className="text-[13.5px] font-medium">Visible sur le site</span>
                  </label>
                  <span className="text-[12.5px] text-ink-faint">
                    {option._count.services === 0
                      ? "Rattachée à aucune prestation"
                      : `Rattachée à ${option._count.services} prestation${
                          option._count.services > 1 ? "s" : ""
                        }`}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <SubmitButton label="Enregistrer" className="btn btn-primary btn-sm" />
                </div>
              </div>
            </form>

            <form action={deleteOption} className="mt-3 border-t border-line pt-3">
              <input type="hidden" name="id" value={option.id} />
              <DeleteButton
                label="Supprimer cette option"
                confirmMessage={`Supprimer l'option « ${option.name} » ? Elle sera retirée des ${option._count.services} prestation(s) qui l'utilisent.`}
              />
            </form>
          </Panel>
        ))}
      </div>
    </>
  );
}
