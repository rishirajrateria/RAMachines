/**
 * app/products/category-icons.ts — one icon per machine family (ADR-0002: every
 * family gets an icon in hero eyebrows, cards and chips). Shared by the products
 * index, the family pages and the location pages' recommended-machine tiles.
 */
import type { CategorySlug } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";

export const categoryIcon: Record<CategorySlug, IconName> = {
  "fiber-laser-cutting-machines": "Laser",
  "cnc-plasma-cutting-machines": "Bolt",
  "mig-tig-arc-welding-machines": "Weld",
  "submerged-arc-welding-machines": "Layers",
  "robotic-welding-systems": "Robot",
};
