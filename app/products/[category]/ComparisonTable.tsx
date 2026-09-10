/**
 * app/products/[category]/ComparisonTable.tsx — spec-by-spec comparison table
 * for every machine in a category, built from `category.comparisonSpecs`
 * (an ordered list of spec labels) against each product's `specs` array.
 * Server Component; wrapped in an overflow-x-auto container since it can run
 * wider than the viewport on mobile.
 */
import Link from "next/link";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";

export default function ComparisonTable({
  products,
  specLabels,
}: {
  products: Product[];
  specLabels: string[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="mb-3 text-left text-xs text-grey-600">
          Specification comparison — machines in this category
        </caption>
        <thead>
          <tr className="border-b border-grey-200">
            <th scope="col" className="w-1/5 py-3 pr-4 text-left font-semibold text-ink">
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
          {specLabels.map((label) => (
            <tr key={label} className="border-b border-grey-200">
              <th scope="row" className="py-3 pr-4 text-left align-top font-semibold text-ink">
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
  );
}
