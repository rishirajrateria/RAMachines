/**
 * app/sitemaps/export.xml/route.ts — child sitemap covering the export hub page
 * plus all 30 export country pages, sourced from data/index.ts.
 */
import { countries } from "@/data";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";
import { buildDate, urlsetXml, xmlHeaders, type SitemapUrlEntry } from "../_shared";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const urls: SitemapUrlEntry[] = [
    { loc: absUrl(paths.exportHub), lastmod: buildDate, priority: 0.8 },
    ...countries.map((c) => ({ loc: absUrl(paths.country(c.slug)), lastmod: buildDate, priority: 0.7 })),
  ];
  return new Response(urlsetXml(urls), { headers: xmlHeaders });
}
