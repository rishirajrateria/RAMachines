/**
 * app/sitemaps/india.xml/route.ts — child sitemap covering all 36 state/UT pages
 * and every city page beneath them (~200 URLs), sourced from data/index.ts.
 */
import { states, cities } from "@/data";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";
import { buildDate, urlsetXml, xmlHeaders, type SitemapUrlEntry } from "../_shared";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const stateUrls: SitemapUrlEntry[] = states.map((s) => ({
    loc: absUrl(paths.state(s.slug)),
    lastmod: buildDate,
    priority: 0.7,
  }));
  const cityUrls: SitemapUrlEntry[] = cities.map((c) => ({
    loc: absUrl(paths.city(c.stateSlug, c.slug)),
    lastmod: buildDate,
    priority: 0.6,
  }));
  return new Response(urlsetXml([...stateUrls, ...cityUrls]), { headers: xmlHeaders });
}
