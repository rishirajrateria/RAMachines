/**
 * components/ui/LinkGrid.tsx — simple multi-column list of links (city lists, category
 * lists, country lists). Use `columns` to control the grid at md breakpoint and above.
 */
import Link from "next/link";

const colClasses = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

export default function LinkGrid({
  links,
  columns = 3,
}: {
  links: { name: string; href: string }[];
  columns?: 2 | 3 | 4;
}) {
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
