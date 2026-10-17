import { DeleteButton, PageHeader, Panel, SubmitButton } from "@/components/admin/ui";
import { NewTestimonialForm } from "@/components/admin/NewTestimonialForm";
import { prisma } from "@/lib/prisma";

import { deleteTestimonial, updateTestimonial } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Avis clients" };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <PageHeader
        title="Avis clients"
        description="Les avis publiés s'affichent sur la page d'accueil, dans l'ordre défini ci-dessous."
      />

      <div className="flex flex-col gap-5">
        <NewTestimonialForm nextPosition={testimonials.length} />

        {testimonials.map((testimonial) => (
          <Panel key={testimonial.id}>
            <form action={updateTestimonial} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={testimonial.id} />

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_100px_100px]">
                <div>
                  <label htmlFor={`author-${testimonial.id}`} className="label">
                    Auteur
                  </label>
                  <input
                    id={`author-${testimonial.id}`}
                    name="author"
                    className="field"
                    defaultValue={testimonial.author}
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`location-${testimonial.id}`} className="label">
                    Localité
                  </label>
                  <input
                    id={`location-${testimonial.id}`}
                    name="location"
                    className="field"
                    defaultValue={testimonial.location ?? ""}
                  />
                </div>
                <div>
                  <label htmlFor={`rating-${testimonial.id}`} className="label">
                    Étoiles
                  </label>
                  <select
                    id={`rating-${testimonial.id}`}
                    name="rating"
                    className="field"
                    defaultValue={String(testimonial.rating)}
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`pos-${testimonial.id}`} className="label">
                    Ordre
                  </label>
                  <input
                    id={`pos-${testimonial.id}`}
                    name="position"
                    type="number"
                    className="field"
                    defaultValue={testimonial.position}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`content-${testimonial.id}`} className="label">
                  Avis
                </label>
                <textarea
                  id={`content-${testimonial.id}`}
                  name="content"
                  rows={3}
                  className="field"
                  defaultValue={testimonial.content}
                  required
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={testimonial.published}
                    className="h-4 w-4 accent-[#C2887A]"
                  />
                  <span className="text-[13.5px] font-medium">Afficher sur le site</span>
                </label>
                <SubmitButton label="Enregistrer" className="btn btn-primary btn-sm" />
              </div>
            </form>

            <form action={deleteTestimonial} className="mt-3 border-t border-line pt-3">
              <input type="hidden" name="id" value={testimonial.id} />
              <DeleteButton
                label="Supprimer cet avis"
                confirmMessage={`Supprimer l'avis de « ${testimonial.author} » ?`}
              />
            </form>
          </Panel>
        ))}
      </div>
    </>
  );
}
