/**
 * app/products/category-icons.ts — one icon per product category (ADR-0002: every
 * category gets an icon in filters, hero chips, comparison-table captions and headline
 * chips). Shared by the products index, category pages and product pages.
 */
import type { CategorySlug } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";

export const categoryIcon: Record<CategorySlug, IconName> = {
  "fiber-laser-cutting-machines": "Sheet",
  "tube-laser-cutting-machines": "Tube",
  "co2-laser-machines": "Beam",
  "robotic-welding-systems": "Robot",
};
