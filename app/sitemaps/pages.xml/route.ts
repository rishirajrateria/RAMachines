/**
 * app/sitemaps/pages.xml/route.ts — child sitemap for the site's static top-level
 * pages. Deliberately excludes /services/laser-cutting-job-work (noindex, see SPEC §6).
 * Note: "/india" is included per the swarm task brief even though data/india-index.ts
 * only backs /india/[state] and /india/[state]/[city] today — if the india worker adds
 * an /india hub page (mirroring the /export hub), this entry is already correct.
 */
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";
import { buildDate, urlsetXml, xmlHeaders, type SitemapUrlEntry } from "../_shared";

export const dynamic = "force-static";

const PAGES: { loc: string; priority: number }[] = [
  { loc: paths.home, priority: 1.0 },
  { loc: paths.products, priority: 0.9 },
  { loc: paths.repair, priority: 0.8 },
  { loc: paths.training, priority: 0.7 },
  { loc: "/india", priority: 0.7 },
  { loc: paths.exportHub, priority: 0.8 },
  { loc: paths.about, priority: 0.6 },
  { loc: paths.contact, priority: 0.6 },
  { loc: paths.certifications, priority: 0.6 },
  { loc: paths.privacy, priority: 0.3 },
  { loc: paths.terms, priority: 0.3 },
];

export async function GET(): Promise<Response> {
  const urls: SitemapUrlEntry[] = PAGES.map((p) => ({
    loc: absUrl(p.loc),
    lastmod: buildDate,
    priority: p.priority,
  }));
  return new Response(urlsetXml(urls), { headers: xmlHeaders });
}
