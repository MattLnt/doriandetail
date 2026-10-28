import type { MetadataRoute } from "next";

import { getPublishedServicesOrEmpty } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

/**
 * Plan du site. Les prestations viennent de la base : une formule publiee
 * depuis le dashboard apparait ici sans intervention.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getPublishedServicesOrEmpty();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/prestations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tarifs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/boutique`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];

  for (const service of services) {
    pages.push({
      url: `${SITE_URL}/prestations/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
