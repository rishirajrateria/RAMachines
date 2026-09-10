"use client";

/**
 * components/ui/useReveal.ts — ADR-0006 §Motion 1: the shared IntersectionObserver
 * hook behind Reveal.tsx and GlassCard's own reveal state (GlassCard needs the same
 * node for its pointermove sheen, so it uses this hook directly instead of an extra
 * wrapper element). Adds `is-in` to the observed element once its top edge enters
 * the viewport (threshold 0, small bottom inset), then disconnects — reveal-on-scroll only ever plays once. Falls back to
 * revealing immediately when IntersectionObserver isn't available (very old browsers)
 * so content is never stuck hidden.
 */
import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => el.classList.add("is-in");

    // Anything already inside (or above) the viewport at hydration is revealed at once —
    // no waiting on observer timing, and nothing near the page bottom can get stuck.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
