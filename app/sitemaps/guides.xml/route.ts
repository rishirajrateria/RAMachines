/**
 * app/sitemaps/guides.xml/route.ts — child sitemap for the buyer guides: the
 * /guides index and every guide, with each guide's own `updated` date.
 */
import { guides } from "@/data/guides";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";
import { buildDate, urlsetXml, xmlHeaders, type SitemapUrlEntry } from "../_shared";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const urls: SitemapUrlEntry[] = [
    { loc: absUrl(paths.guides), lastmod: buildDate, priority: 0.7 },
    ...guides.map((g) => ({ loc: absUrl(paths.guide(g.slug)), lastmod: g.updated, priority: 0.7 })),
  ];
  return new Response(urlsetXml(urls), { headers: xmlHeaders });
}
