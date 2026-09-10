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

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      // threshold 0 + a small bottom inset: fire as soon as the element's top edge is ~8% into
      // the viewport, regardless of how tall the element is (a 15% area threshold never
      // triggers for very tall sections while only their top is on screen).
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
