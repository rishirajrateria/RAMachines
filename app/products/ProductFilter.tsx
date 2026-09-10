"use client";

/**
 * app/products/ProductFilter.tsx — tiny client-side category filter for the
 * /products grid. All product cards are rendered on the server as `children`
 * (each wrapped in an element carrying a `data-category` attribute); this
 * component only toggles the native `hidden` attribute on those wrappers, so
 * with JavaScript disabled every card stays visible and the page still works.
 */
import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";

type FilterOption = { slug: string; name: string };

const ALL = "all";

function buttonClass(active: boolean): string {
  return [
    "inline-flex h-11 items-center rounded border px-4 text-sm font-semibold transition-colors",
    active
      ? "border-steel bg-steel text-white"
      : "border-grey-300 text-ink hover:border-steel hover:text-steel",
  ].join(" ");
}

export default function ProductFilter({
  categories,
  children,
}: {
  categories: FilterOption[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<string>(ALL);

  return (
    <div>
      <div role="group" aria-label="Filter machines by category" className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={active === ALL}
          className={buttonClass(active === ALL)}
          onClick={() => setActive(ALL)}
        >
          All Machines
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            aria-pressed={active === category.slug}
            className={buttonClass(active === category.slug)}
            onClick={() => setActive(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const element = child as ReactElement<{ "data-category"?: string; hidden?: boolean }>;
          const category = element.props["data-category"];
          const hidden = active !== ALL && category !== active;
          return cloneElement(element, { hidden });
        })}
      </div>
    </div>
  );
}
