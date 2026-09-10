/**
 * lib/seo.ts — shared metadata builder. Every route's `generateMetadata` should call
 * `buildMetadata` so canonical URLs, Open Graph, Twitter cards and robots directives stay
 * consistent site-wide. `absUrl`/`truncate` are small helpers used alongside it.
 */
import type { Metadata } from "next";
import { site } from "@/config/site";

export function absUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean === "/" ? "" : clean}`;
}

export function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1).replace(/\s+\S*$/, "");
  return `${cut}…`;
}

export function buildMetadata(o: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogTitle?: string;
}): Metadata {
  const url = absUrl(o.path);
  const description = truncate(o.description, 155);
  return {
    title: o.title,
    description,
    alternates: {
      canonical: url,
      languages: { en: url, "x-default": url },
    },
    robots: o.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: o.ogTitle ?? o.title,
      description,
      url,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: o.ogTitle ?? o.title,
      description,
    },
  };
}
