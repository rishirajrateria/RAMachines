"use client";

/**
 * components/layout/HeaderBar.tsx — ADR-0006 §Motion 3: the tiny client hook behind
 * the floating nav pill's scroll state. `is-scrolled` toggles once the page has
 * scrolled past 24px — the pill then goes slightly more opaque (.75 → .85), blur
 * 32 → 40, the shadow deepens (all via the `.header-pill.is-scrolled` CSS in
 * app/globals.css) and the bar shrinks 56px → 50px, over 250ms. Everything else in
 * Header stays a Server Component; only this thin shell needs the browser.
 *
 * ADR-0009 §3: no scroll listener — an `IntersectionObserver` watches the 24px-tall
 * `#scroll-sentinel` (app/layout.tsx, sits in flow at the very top of the page).
 * `is-scrolled` is simply "the sentinel is no longer intersecting the viewport",
 * which fires once per crossing instead of on every scroll frame.
 */
import { useEffect, useState, type ReactNode } from "react";

export default function HeaderBar({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel || typeof IntersectionObserver === "undefined") {
      setScrolled(window.scrollY > 24);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`header-pill glass-strong flex items-center justify-between gap-4 rounded-full px-4 md:px-5 ${
        scrolled ? "is-scrolled h-[50px]" : "h-14"
      }`}
    >
      {children}
    </div>
  );
}
