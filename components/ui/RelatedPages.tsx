/**
 * components/ui/RelatedPages.tsx — "related pages" internal-linking module for the
 * bottom of programmatic pages (states, cities, countries, products). Rendered as
 * rounded chip-style link tiles (ADR-0002) rather than a bare text list.
 */
import Link from "next/link";
import { ArrowRight } from "./Icons";

export default function RelatedPages({
  title = "Related pages",
  links,
}: {
  title?: string;
  links: { name: string; href: string; hint?: string }[];
}) {
  if (!links.length) return null;
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="flex flex-wrap gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center gap-2 rounded-lg border border-grey-200 bg-white px-4 py-2.5 text-sm text-ink transition-colors hover:border-spark hover:text-spark-hover"
            >
              <span>
                {link.name}
                {link.hint && <span className="block text-xs text-grey-500">{link.hint}</span>}
              </span>
              <ArrowRight
                width={14}
                height={14}
                className="shrink-0 text-grey-400 transition-transform group-hover:translate-x-0.5 group-hover:text-spark"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
