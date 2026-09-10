/**
 * app/robots.ts — generates /robots.txt via Next's static metadata-route convention.
 * Allows everything except the noindex job-work page (SPEC §6) and points crawlers
 * at the sitemap index.
 */
import type { MetadataRoute } from "next";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [paths.jobWork],
    },
    sitemap: absUrl("/sitemap.xml"),
  };
}
