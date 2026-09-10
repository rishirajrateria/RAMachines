"use client";

/**
 * components/layout/MobileNav.tsx — ADR-0005 §5: a glass-circle menu button that
 * opens a glass sheet. The site's only other client component in the header.
 * Escape closes it; aria-expanded/aria-controls kept in sync.
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
        className="glass-pill flex h-10 w-10 items-center justify-center p-0 text-ink"
      >
        {open ? <Close width={18} height={18} /> : <Menu width={18} height={18} />}
      </button>

      {open && (
        <div id="mobile-nav-panel" className="fixed inset-x-3 top-[4.5rem] z-30">
          <nav aria-label="Mobile" className="glass-strong max-h-[75vh] overflow-y-auto rounded-[28px] px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center gap-3 rounded-2xl px-2 text-base font-semibold text-ink hover:bg-white/40"
                  >
                    <span className="glass-pill flex h-9 w-9 items-center justify-center p-0 text-teal">
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
              className="glass-pill mt-4 flex h-11 items-center justify-center gap-1.5 text-sm font-semibold text-ink"
            >
              RA Auto <ArrowUpRight width={14} height={14} />
            </a>
            <div className="mt-3">
              <Button href="/contact#quote" variant="solid" className="w-full" onClick={() => setOpen(false)}>
                Request quote
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
