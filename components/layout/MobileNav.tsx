"use client";

/**
 * components/layout/MobileNav.tsx — the site's only other client component in the
 * header: a ≥44px toggle button that opens a full-width mobile menu panel. Escape
 * closes it; aria-expanded/aria-controls kept in sync. ADR-0002: each nav item gets a
 * small icon tile, and the Request Quote button uses the spark tone.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { Menu, Close, ArrowUpRight, Icon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import { navLinks } from "./navLinks";

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
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-grey-300 text-ink"
      >
        {open ? <Close width={20} height={20} /> : <Menu width={20} height={20} />}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-white"
        >
          <nav aria-label="Mobile" className="px-4 py-6">
            <ul className="space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center gap-3 rounded-lg px-2 text-base font-semibold text-ink hover:bg-steel-soft"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel-soft text-steel">
                      <Icon name={link.icon} size={18} />
                    </span>
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
              className="mt-6 flex h-11 items-center justify-center gap-1.5 rounded-lg border border-grey-300 text-sm font-semibold text-ink"
            >
              RA Auto <ArrowUpRight width={14} height={14} />
            </a>
            <div className="mt-3">
              <Button
                href="/contact#quote"
                variant="solid"
                tone="spark"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Request Quote
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
