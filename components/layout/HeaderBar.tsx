"use client";

/**
 * components/layout/HeaderBar.tsx — ADR-0006 §Motion 3: the tiny client hook behind
 * the floating nav pill's scroll state. A passive, rAF-throttled scroll listener
 * toggles `is-scrolled` once the page has scrolled past 24px — the pill then goes
 * slightly more opaque (.75 → .85), blur 32 → 40, the shadow deepens (all via the
 * `.header-pill.is-scrolled` CSS in app/globals.css) and the bar shrinks 56px → 50px,
 * over 250ms. Everything else in Header stays a Server Component; only this thin
 * shell needs the browser.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function HeaderBar({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 24);
      ticking.current = false;
    }
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
