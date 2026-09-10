"use client";

/**
 * components/layout/MobileNav.tsx — the site's only other client component in the
 * header: a ≥44px toggle button that opens a full-width mobile menu panel. Escape
 * closes it; aria-expanded/aria-controls kept in sync.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { Menu, Close, ArrowUpRight } from "@/components/ui/Icons";

const navLinks = [
  { name: "Products", href: paths.products },
  { name: "Repair", href: paths.repair },
  { name: "Training", href: paths.training },
  { name: "Export", href: paths.exportHub },
  { name: "About", href: paths.about },
  { name: "Contact", href: paths.contact },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded border border-grey-300 text-ink"
      >
        {open ? <Close width={20} height={20} /> : <Menu width={20} height={20} />}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-white"
        >
          <nav aria-label="Mobile" className="px-4 py-6">
            <ul className="divide-y divide-grey-200">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center text-base font-semibold text-ink"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={site.raAuto.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RA Auto, opens in new tab"
              className="mt-6 flex h-11 items-center justify-center gap-1.5 rounded border border-grey-300 text-sm font-semibold text-ink"
            >
              RA Auto <ArrowUpRight width={14} height={14} />
            </a>
            <Link
              href="/contact#quote"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-11 items-center justify-center rounded bg-steel text-sm font-semibold text-white"
            >
              Request Quote
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
