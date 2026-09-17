"use client";

/**
 * components/ui/useReveal.ts — ADR-0006 §Motion 1: the shared reveal-on-scroll hook
 * behind Reveal.tsx and GlassCard's own reveal state (GlassCard needs the same node
 * for its pointermove sheen, so it uses this hook directly instead of an extra
 * wrapper element). Adds `is-in` to the observed element once its top edge enters
 * the viewport, then stops watching it — reveal-on-scroll only ever plays once.
 *
 * ADR-0009 §3: the actual `IntersectionObserver` lives in `components/ui/observer`,
 * one instance shared across every `Reveal`/`GlassCard` on the page (previously one
 * per instance — a page easily has 30+). Falls back to revealing immediately when
 * `IntersectionObserver` isn't available (very old browsers) so content is never
 * stuck hidden.
 */
import { useEffect, useRef } from "react";
import { observeOnce } from "./observer";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => el.classList.add("is-in"));
  }, []);

  return ref;
}
