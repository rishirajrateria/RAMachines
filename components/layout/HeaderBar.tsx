/**
 * components/layout/HeaderBar.tsx — the floating nav pill. ADR-0006 §Motion 3: past
 * 24px of scroll the pill goes slightly more opaque (.75 → .85), blur 32 → 40, the
 * shadow deepens and the bar shrinks 56px → 50px over 250ms — all from the
 * `.header-pill.is-scrolled` rules in app/globals.css.
 *
 * ADR-0010: a Server Component that renders the resting state. public/enhance.js
 * toggles `is-scrolled` using an IntersectionObserver on the 24px `#scroll-sentinel`
 * in app/layout.tsx — one callback per crossing rather than work on every scroll
 * frame — and falls back to a passive scroll listener where IntersectionObserver
 * is missing. Without JS the pill simply keeps its resting appearance.
 */
import type { ReactNode } from "react";

export default function HeaderBar({ children }: { children: ReactNode }) {
  return (
    // `relative z-30` keeps the pill — and so the menu's close button — above the
    // mobile menu's backdrop, which covers the whole viewport at z-10. Without it
    // the scrim painted over the header and the only visible way out of the menu
    // was to guess that tapping the dimmed area would close it.
    <div className="header-pill glass-strong relative z-30 flex h-14 items-center justify-between gap-4 rounded-full px-4 md:px-5">
      {children}
    </div>
  );
}
