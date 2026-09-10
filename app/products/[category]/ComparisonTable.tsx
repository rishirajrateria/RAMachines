/**
 * app/products/[category]/ComparisonTable.tsx — spec-by-spec comparison table
 * for every machine in a category, built from `category.comparisonSpecs`
 * (an ordered list of spec labels) against each product's `specs` array.
 * Server Component; wrapped in an overflow-x-auto container since it can run
 * wider than the viewport on mobile. ADR-0002: rounded card, a tinted icon
 * caption (matching SpecTable) and zebra-striped rows.
 */
import Link from "next/link";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";
import { Icon, type IconName } from "@/components/ui/Icons";

export default function ComparisonTable({
  products,
  specLabels,
  icon = "Ruler",
  categoryName,
}: {
  products: Product[];
  specLabels: string[];
  icon?: IconName;
  categoryName: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-grey-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="caption-top border-b border-grey-200 bg-steel-soft px-4 py-3 text-left">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel">
              <Icon name={icon} size={16} />
              Specification comparison — {categoryName}
            </span>
          </caption>
          <thead>
            <tr className="border-b border-grey-200 bg-white">
              <th scope="col" className="w-1/5 py-3 pl-4 pr-4 text-left font-semibold text-ink">
                Specification
              </th>
              {products.map((product) => (
                <th key={product.slug} scope="col" className="py-3 pr-4 text-left font-semibold text-ink">
                  <Link href={paths.product(product.category, product.slug)} className="hover:text-steel">
                    {product.sku}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specLabels.map((label, i) => (
              <tr key={label} className={i % 2 === 1 ? "bg-grey-50" : "bg-white"}>
                <th scope="row" className="py-3 pl-4 pr-4 text-left align-top font-semibold text-ink">
                  {label}
                </th>
                {products.map((product) => {
                  const spec = product.specs.find((row) => row.label === label);
                  return (
                    <td key={product.slug} className="py-3 pr-4 align-top text-grey-700">
                      {spec?.value ?? "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
