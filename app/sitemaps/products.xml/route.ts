/**
 * app/sitemaps/products.xml/route.ts — child sitemap covering the 4 category
 * landing pages and 8 product pages (12 URLs total), sourced from data/index.ts.
 */
import { categories, products } from "@/data";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";
import { buildDate, urlsetXml, xmlHeaders, type SitemapUrlEntry } from "../_shared";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const categoryUrls: SitemapUrlEntry[] = categories.map((c) => ({
    loc: absUrl(paths.category(c.slug)),
    lastmod: buildDate,
    priority: 0.8,
  }));
  const productUrls: SitemapUrlEntry[] = products.map((p) => ({
    loc: absUrl(paths.product(p.category, p.slug)),
    lastmod: buildDate,
    priority: 0.8,
  }));
  return new Response(urlsetXml([...categoryUrls, ...productUrls]), { headers: xmlHeaders });
}
