/**
 * components/layout/MobileNav.tsx — ADR-0005 §5: a glass-circle menu button that
 * opens a glass sheet. Escape closes it; aria-expanded/aria-controls kept in sync.
 * ADR-0006 §Motion 7: the sheet slides down + fades in (250ms) and the backdrop
 * fades with it — both stay mounted (`.mobilenav-panel`/`.mobilenav-backdrop`,
 * toggled via `.is-open`) so the closing transition can play too.
 *
 * ADR-0010: a Server Component. Both icons are rendered and toggled with the
 * `hidden` attribute, and the trigger is a real `<a href="#mobile-nav-panel">`,
 * so with JavaScript off the `:target` rules in app/globals.css still open the
 * sheet and the nav remains usable on mobile. public/enhance.js upgrades that
 * anchor into a `button`-like toggle (aria-expanded, `inert` on the closed
 * panel, Escape and backdrop to close, and closing on link activation).
 */
import Link from "next/link";
import { site } from "@/config/site";
import { Menu, Close, ArrowUpRight, Icon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import { navLinks } from "./navLinks";

export default function MobileNav() {
  return (
    <div className="md:hidden">
      <a
        href="#mobile-nav-panel"
        data-navtoggle
        role="button"
        aria-expanded="false"
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
        className="glass-pill flex h-11 w-11 items-center justify-center p-0 text-ink"
      >
        <span data-navicon="open" className="flex">
          <Menu width={18} height={18} />
        </span>
        <span data-navicon="close" className="flex" hidden>
          <Close width={18} height={18} />
        </span>
      </a>

      <a
        href="#main"
        aria-hidden="true"
        tabIndex={-1}
        className="mobilenav-backdrop fixed inset-0 z-20"
      />

      <div id="mobile-nav-panel" className="mobilenav-panel fixed inset-x-3 top-[4.5rem] z-30">
        <nav aria-label="Mobile" className="glass-strong max-h-[75vh] overflow-y-auto rounded-[28px] px-4 py-6">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
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
            <Button href="/contact#quote" variant="solid" className="w-full">
              Request quote
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
