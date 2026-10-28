import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * Sans ce fichier, /robots.txt renvoyait une 404 : les robots n'avaient
 * aucun plan du site a suivre.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
