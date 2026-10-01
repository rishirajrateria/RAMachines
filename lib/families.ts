/**
 * lib/families.ts — resolves the `recommendedFamilies` lists in the city, state
 * and country data into the machine families themselves, for the
 * "recommended machines" tiles, the industry rows' links and the JSON-LD
 * ItemLists on location pages.
 */
import { categories } from "@/data/categories";
import type { Category, CategorySlug } from "@/data/types";
import { absUrl } from "@/lib/seo";

/** Distinct families in first-seen order, at most `limit`. */
export function familiesFor(slugs: readonly CategorySlug[], limit = 3): Category[] {
  const out: Category[] = [];
  for (const slug of slugs) {
    if (out.length === limit) break;
    if (out.some((c) => c.slug === slug)) continue;
    const family = categories.find((c) => c.slug === slug);
    if (family) out.push(family);
  }
  return out;
}

/** ItemList JSON-LD of recommended families (no prices, no model numbers). */
export function familyListSchema(list: Category[]): object {
  return {
    "@type": "ItemList",
    itemListElement: list.map((family, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: family.name,
      url: absUrl(`/products/${family.slug}`),
    })),
  };
}
