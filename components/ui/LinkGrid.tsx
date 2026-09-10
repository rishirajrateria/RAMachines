/**
 * components/ui/LinkGrid.tsx — simple multi-column list of links (city lists, category
 * lists, country lists). Use `columns` to control the grid at md breakpoint and above.
 * `variant="chips"` (ADR-0002) renders the same links as wrapping pill chips instead —
 * handy for shorter, denser lists (industry tags, related categories).
 */
import Link from "next/link";
import Chips from "./Chips";

const colClasses = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

export default function LinkGrid({
  links,
  columns = 3,
  variant = "list",
}: {
  links: { name: string; href: string }[];
  columns?: 2 | 3 | 4;
  variant?: "list" | "chips";
}) {
  if (variant === "chips") {
    return <Chips items={links.map((link) => ({ label: link.name, href: link.href }))} />;
  }

  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-2 ${colClasses[columns]}`}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-sm text-grey-600 hover:text-steel">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
