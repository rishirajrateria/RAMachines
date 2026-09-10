/**
 * components/ui/RelatedPages.tsx — "related pages" internal-linking module for
 * the bottom of programmatic pages (states, cities, countries, products).
 * ADR-0005: rendered as glass pill/tile links rather than orange-bordered chips.
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
            <Link href={link.href} className="glass glass-hover group flex items-center gap-2 px-4 py-2.5 text-sm text-ink">
              <span>
                {link.name}
                {link.hint && <span className="block text-xs text-grey-500">{link.hint}</span>}
              </span>
              <ArrowRight width={14} height={14} className="shrink-0 text-teal transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
