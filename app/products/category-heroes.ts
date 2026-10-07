/**
 * app/products/category-heroes.ts — the hero image for each machine family,
 * shared by the family pages and the buyer guides (a guide uses the hero of the
 * first family it leads to).
 */
import type { CategorySlug } from "@/data/types";
import type { PhotoKey } from "@/lib/photos";

export const categoryHero: Record<CategorySlug, PhotoKey> = {
  "fiber-laser-cutting-machines": "hero-fiber",
  "cnc-plasma-cutting-machines": "hero-plasma",
  "mig-tig-arc-welding-machines": "hero-arc-welding",
  "submerged-arc-welding-machines": "hero-saw",
  "robotic-welding-systems": "hero-welding",
};
