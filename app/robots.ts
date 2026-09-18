/**
 * app/robots.ts — generates /robots.txt via Next's static metadata-route
 * convention, and points crawlers at the sitemap index.
 *
 * Nothing is disallowed, deliberately. The job-work page is meant to stay out of
 * the index (SPEC §6) and carries `<meta name="robots" content="noindex, follow">`
 * to say so. Disallowing it here as well was self-defeating: robots.txt blocks
 * CRAWLING, so a blocked page is never fetched and its noindex is never read —
 * and because every page in the site links to it, Google would still discover
 * the URL and could list it with no description at all. Letting it be crawled is
 * what actually keeps it out, and `follow` keeps its outgoing links working.
 */
export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absUrl("/sitemap.xml"),
  };
}
