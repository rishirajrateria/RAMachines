/**
 * app/products/[category]/ComparisonTable.tsx — spec-by-spec comparison table
 * for every machine in a category, built from `category.comparisonSpecs`
 * (an ordered list of spec labels) against each product's `specs` array.
 * Server Component; wrapped in an overflow-x-auto container since it can run
 * wider than the viewport on mobile. ADR-0005 §6: "comparison table inside one
 * glass panel (hairline rows)" — no tinted caption band, no zebra striping.
 */
import Link from "next/link";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";

export default function ComparisonTable({
  products,
  specLabels,
  categoryName,
}: {
  products: Product[];
  specLabels: string[];
  categoryName: string;
}) {
  return (
    <div className="glass overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Specification comparison — {categoryName}</caption>
          <thead>
            <tr className="border-b border-[rgba(15,26,26,0.08)]">
              <th scope="col" className="w-1/5 py-3 pl-5 pr-4 text-left font-semibold text-ink">
                Specification
              </th>
              {products.map((product) => (
                <th key={product.slug} scope="col" className="py-3 pr-4 text-left font-semibold text-ink">
                  <Link href={paths.product(product.category, product.slug)} className="hover:text-teal">
                    {product.sku}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specLabels.map((label) => (
              <tr key={label} className="border-b border-[rgba(15,26,26,0.08)] last:border-b-0">
                <th scope="row" className="py-3 pl-5 pr-4 text-left align-top font-semibold text-ink">
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
