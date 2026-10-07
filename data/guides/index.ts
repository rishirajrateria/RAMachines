/**
 * data/guides/index.ts — the buyer guides (/guides), one file per guide.
 *
 * To add a guide: create data/guides/<slug>.ts exporting `guide: Guide`
 * (data/types.ts), import it below and add it to `guides` in the order it
 * should be listed. The guide page, sitemap, llms.txt and the "Buyer guides"
 * lists on machine-family pages all read from here.
 */
import type { CategorySlug, Guide } from "../types";

// Guide files are added in the next commit.
export const guides: Guide[] = [];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Guides that lead to a given machine family, for its "Buyer guides" list. */
export function guidesForFamily(slug: CategorySlug): Guide[] {
  return guides.filter((g) => g.families.includes(slug));
}

/** Word count of a guide's visible body (summary, sections, FAQs). */
export function guideWords(g: Guide): number {
  const text = [g.summary, ...g.sections.flatMap((s) => [s.h2, ...s.paragraphs, ...(s.bullets ?? [])]), ...g.faqs.flatMap((f) => [f.q, f.a])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
