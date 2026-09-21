"use client";

/**
 * components/layout/HeaderNavLinks.tsx — ADR-0006 §Motion 3: the desktop primary
 * nav list.
 *
 * ADR-0010: the one component still marked "use client", and it ships no client
 * JavaScript. `usePathname()` is simply how a component nested inside the root
 * layout reads the current route, and under `output: 'export'` every route is
 * prerendered — so this runs at BUILD time, once per page, and each page's HTML
 * is emitted with its own correct active link already marked. The directive is
 * what makes that hook legal, not a statement that the browser needs it; the
 * dehydrate step strips the resulting chunk like every other one.
 *
 * The
 * active link gets a soft glass pill behind it via a layout-free `::before`
 * pseudo-element (`.nav-link.is-active`) — no reflow, just an absolutely
 * positioned, faded-in background.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./navLinks";

export default function HeaderNavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {navLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-ink ${
                  active ? "is-active text-ink" : ""
                }`.trim()}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
