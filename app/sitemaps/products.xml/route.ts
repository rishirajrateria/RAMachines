/**
 * app/sitemaps/products.xml/route.ts — child sitemap covering the products
 * index and the five machine-family pages, sourced from data/index.ts. (There
 * are no per-model pages; the old ones 301 to their family — vercel.json.)
 */
import { categories } from "@/data";
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
  return new Response(urlsetXml(categoryUrls), { headers: xmlHeaders });
}
