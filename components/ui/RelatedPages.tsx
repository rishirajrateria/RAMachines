/**
 * components/ui/RelatedPages.tsx — "related pages" internal-linking module for the
 * bottom of programmatic pages (states, cities, countries, products).
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
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-grey-600">
        {title}
      </p>
      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-start gap-1.5 text-sm text-ink hover:text-steel"
            >
              <ArrowRight
                width={14}
                height={14}
                className="mt-0.5 shrink-0 text-grey-400 transition-transform group-hover:translate-x-0.5 group-hover:text-steel"
              />
              <span>
                {link.name}
                {link.hint && <span className="block text-xs text-grey-600">{link.hint}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
