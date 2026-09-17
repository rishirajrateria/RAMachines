/**
 * app/products/ProductFilter.tsx — the category filter above the /products grid.
 * All product cards are rendered on the server as `children` (each wrapped in an
 * element carrying a `data-category` attribute); filtering only toggles the
 * native `hidden` attribute on those wrappers.
 *
 * ADR-0010: a Server Component. The chips are real links to the category pages,
 * so with JavaScript disabled every card stays visible and each chip still takes
 * you somewhere useful (the category's own page). public/enhance.js intercepts
 * the click and filters in place instead.
 *
 * They are therefore plain links in the markup — no `aria-pressed`, which is not
 * a valid attribute on a link and would misdescribe them to assistive tech for
 * any visitor without JavaScript, for whom they really are navigation. It is
 * enhance.js, at the moment it takes the clicks over, that promotes them to
 * `role="button"` and starts reporting `aria-pressed` — so the announced
 * semantics always match what the control actually does.
 *
 * ADR-0002: chips use the `.chip` pill look, with `!` important utilities so the
 * active state can override the shared `.chip` colours without editing globals.css.
 */
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icons";
import { paths } from "@/lib/urls";

type FilterOption = { slug: string; name: string; icon?: IconName };

const ALL = "all";

/** Mirrors the class lists public/enhance.js toggles, so the two never drift. */
function chipClass(active: boolean): string {
  return [
    "chip h-11 border transition-colors",
    active
      ? "is-active !border-teal !bg-teal !text-white [&_svg]:!text-white"
      : "border-transparent hover:!border-teal hover:!text-teal-hover",
  ].join(" ");
}

export default function ProductFilter({
  categories,
  children,
}: {
  categories: FilterOption[];
  children: ReactNode;
}) {
  return (
    <div>
      <div role="group" aria-label="Filter machines by category" className="flex flex-wrap gap-2.5">
        <a data-filter={ALL} href={paths.products} className={chipClass(true)}>
          <Icon name="Layers" size={16} />
          All Machines
        </a>
        {categories.map((category) => (
          <a
            key={category.slug}
            data-filter={category.slug}
            href={`${paths.products}/${category.slug}`}
            className={chipClass(false)}
          >
            {category.icon && <Icon name={category.icon} size={16} />}
            {category.name}
          </a>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
}
