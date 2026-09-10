/**
 * components/ui/Breadcrumbs.tsx — ADR-0005 §6: tiny grey text above the hero
 * panel. Visible breadcrumb nav + BreadcrumbList JSON-LD. `items` should include
 * the current page as the last entry (rendered non-link).
 */
import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="py-3 text-xs text-grey-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {isLast ? (
                  <span aria-current="page" className="text-grey-600">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-teal">
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
