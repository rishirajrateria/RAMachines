/**
 * app/sitemap.xml/route.ts — the sitemap index at /sitemap.xml. Points to the four
 * child sitemaps under /sitemaps/*.xml (see app/sitemaps/**). Static route handler
 * (`dynamic = "force-static"`) so it is emitted as a plain XML file at build time,
 * compatible with `output: "export"`.
 */
import { absUrl } from "@/lib/seo";
import { buildDate, sitemapIndexXml, xmlHeaders } from "@/app/sitemaps/_shared";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const xml = sitemapIndexXml([
    { loc: absUrl("/sitemaps/pages.xml"), lastmod: buildDate },
    { loc: absUrl("/sitemaps/products.xml"), lastmod: buildDate },
    { loc: absUrl("/sitemaps/india.xml"), lastmod: buildDate },
    { loc: absUrl("/sitemaps/export.xml"), lastmod: buildDate },
  ]);
  return new Response(xml, { headers: xmlHeaders });
}
