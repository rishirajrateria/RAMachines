"use client";

/**
 * app/products/ProductFilter.tsx — tiny client-side category filter for the
 * /products grid. All product cards are rendered on the server as `children`
 * (each wrapped in an element carrying a `data-category` attribute); this
 * component only toggles the native `hidden` attribute on those wrappers, so
 * with JavaScript disabled every card stays visible and the page still works.
 * ADR-0002: filter buttons are restyled as icon chips (the `.chip` pill look),
 * using `!` important utilities so the active state can override the shared
 * `.chip` colours without editing globals.css.
 */
import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icons";

type FilterOption = { slug: string; name: string; icon?: IconName };

const ALL = "all";

function chipClass(active: boolean): string {
  return [
    "chip h-11 border transition-colors",
    active
      ? "!border-spark !bg-spark !text-white [&_svg]:!text-white"
      : "border-transparent hover:!border-spark hover:!text-spark-hover",
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
      <div role="group" aria-label="Filter machines by category" className="flex flex-wrap gap-2.5">
        <button
          type="button"
          aria-pressed={active === ALL}
          className={chipClass(active === ALL)}
          onClick={() => setActive(ALL)}
        >
          <Icon name="Layers" size={16} />
          All Machines
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            aria-pressed={active === category.slug}
            className={chipClass(active === category.slug)}
            onClick={() => setActive(category.slug)}
          >
            {category.icon && <Icon name={category.icon} size={16} />}
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
