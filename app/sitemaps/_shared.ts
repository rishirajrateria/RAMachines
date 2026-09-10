/**
 * app/sitemaps/_shared.ts — small XML builders shared by the sitemap index
 * (app/sitemap.xml/route.ts) and its four child sitemaps (app/sitemaps/*.xml/route.ts).
 * Not a route itself (no `route.ts`/`page.tsx` export), so Next ignores it as a segment.
 *
 * `buildDate` is computed once when this module is first evaluated. Because every
 * sitemap route below is `force-static`, that evaluation happens at build time, so
 * every <lastmod> across every child sitemap shares the same build-time ISO date —
 * exactly what "lastmod (build date ISO)" in the spec asks for.
 */

export const buildDate = new Date().toISOString();

export const xmlHeaders = { "Content-Type": "application/xml; charset=utf-8" };

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  priority: number;
}

export interface SitemapIndexEntry {
  loc: string;
  lastmod: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Builds a <urlset> child sitemap document from a flat list of URL entries. */
export function urlsetXml(urls: SitemapUrlEntry[]): string {
  const items = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

/** Builds the top-level <sitemapindex> document that points at the child sitemaps. */
export function sitemapIndexXml(sitemaps: SitemapIndexEntry[]): string {
  const items = sitemaps
    .map((s) => `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}
