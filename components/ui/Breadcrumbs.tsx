/**
 * components/ui/Breadcrumbs.tsx — visible breadcrumb nav + BreadcrumbList JSON-LD.
 * `items` should include the current page as the last entry (rendered non-link).
 */
import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { ArrowRight } from "./Icons";

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="py-3 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-grey-500">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {i > 0 && <ArrowRight width={12} height={12} className="text-grey-400" />}
                {isLast ? (
                  <span aria-current="page" className="text-grey-700">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-steel">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
