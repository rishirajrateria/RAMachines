/**
 * components/layout/MobileNav.tsx — the mobile menu: a glass circle button that
 * opens a sheet below the header.
 *
 * ADR-0006 §Motion 7: the sheet slides down + fades in (250ms) and the backdrop
 * fades with it — both stay mounted (`.mobilenav-panel`/`.mobilenav-backdrop`,
 * toggled via `.is-open`) so the closing transition can play too.
 *
 * ADR-0010: a Server Component. Both icons are rendered and toggled with the
 * `hidden` attribute, and the trigger is a real `<a href="#mobile-nav-panel">`,
 * so with JavaScript off the `:target` rules in app/globals.css still open the
 * sheet and the nav remains usable. public/enhance.js upgrades that anchor into
 * a `button`-like toggle (aria-expanded, `inert` on the closed panel, Escape and
 * backdrop to close, and closing on link activation).
 *
 * The sheet uses `.mobilenav-sheet`, not the shared `.glass-strong`: it overlays
 * page content rather than sitting on the page canvas, and the shared class has
 * no backdrop blur (ADR-0009 §4), so the hero headline read straight through the
 * open menu. Rows are full-width `.mobilenav-row` targets with a hairline
 * between them and a chevron, instead of loose text.
 *
 * WHY THIS IS SPLIT IN TWO. The toggle belongs inside the header pill; the sheet
 * and its backdrop must NOT be. `.header-pill` carries `backdrop-filter`, and a
 * filtered element becomes the containing block for `position: fixed`
 * descendants — so a sheet rendered inside it resolved `fixed inset-0` against
 * the PILL, not the viewport. Measured: the full-screen backdrop was painting at
 * 356x54px, the size of the pill itself, which is why the menu sat at the wrong
 * width and the page behind it was never dimmed. Header.tsx renders the toggle
 * inside <HeaderBar> and the sheet as its sibling, outside the pill.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { Menu, Close, ArrowUpRight, ArrowRight, Icon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import { navLinks } from "./navLinks";

/** The trigger. Lives inside the header pill. */
export function MobileNavToggle() {
  return (
    <div className="md:hidden">
      <a
        href="#mobile-nav-panel"
        data-navtoggle
        role="button"
        aria-expanded="false"
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
        className="icon-pill h-11 w-11 text-ink"
      >
        <span data-navicon="open" className="flex">
          <Menu width={20} height={20} />
        </span>
        <span data-navicon="close" className="flex" hidden>
          <Close width={20} height={20} />
        </span>
      </a>
    </div>
  );
}

/** The sheet and its backdrop. Must render OUTSIDE the header pill — see above. */
export function MobileNavSheet() {
  return (
    <div className="md:hidden">
      <a
        href="#main"
        aria-hidden="true"
        tabIndex={-1}
        className="mobilenav-backdrop fixed inset-0 z-10"
      />

      <div id="mobile-nav-panel" className="mobilenav-panel fixed inset-x-3 top-[4.5rem] z-20">
        <nav
          aria-label="Mobile"
          className="mobilenav-sheet max-h-[calc(100svh-6rem)] overflow-y-auto rounded-[26px] p-5"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="mobilenav-row">
                  <span className="icon-pill h-10 w-10 text-teal">
                    <Icon name={link.icon} size={18} />
                  </span>
                  <span className="text-[17px]">{link.name}</span>
                  <ArrowRight width={16} height={16} className="mobilenav-chevron" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-[color:var(--hairline)] pt-5">
            <Button href="/contact#quote" variant="solid" className="w-full">
              Request quote
            </Button>
            <a
              href={site.raAuto.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RA Auto, opens in new tab"
              className="mt-3 flex h-11 items-center justify-center gap-1.5 text-sm font-semibold text-grey-600 hover:text-teal"
            >
              RA Auto <ArrowUpRight width={14} height={14} />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
