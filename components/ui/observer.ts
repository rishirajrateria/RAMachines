"use client";

/**
 * components/ui/observer.ts — ADR-0009 §3: one module-level `IntersectionObserver`
 * shared by every scroll-triggered effect on the page (`Reveal`/`GlassCard`'s
 * reveal-on-scroll, `CountUp`, `HeroVideo`'s intersection-mount) instead of each
 * instance creating its own — a page can easily have 30+ `Reveal`s; this collapses
 * that to a single observer with a per-element callback registry.
 *
 * `observeOnce(el, cb)` fires `cb` the first time `el` is at or near the viewport
 * (matching the previous per-instance behaviour: an element already on screen at
 * call time fires synchronously, with no observer round-trip), then stops watching
 * it. Falls back to firing `cb` immediately when `IntersectionObserver` isn't
 * available, so nothing is ever left in a "waiting to reveal" state.
 */
type Callback = (entry: IntersectionObserverEntry | null) => void;

const registry = new Map<Element, Callback>();
let sharedObserver: IntersectionObserver | null = null;

function handleEntries(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
      const cb = registry.get(entry.target);
      if (!cb) continue;
      registry.delete(entry.target);
      sharedObserver?.unobserve(entry.target);
      cb(entry);
    }
  }
}

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(handleEntries, { threshold: 0 });
  }
  return sharedObserver;
}

export function observeOnce(el: Element, cb: Callback): () => void {
  if (typeof window !== "undefined") {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      cb(null);
      return () => {};
    }
  }

  const observer = getObserver();
  if (!observer) {
    cb(null);
    return () => {};
  }

  registry.set(el, cb);
  observer.observe(el);
  return () => {
    registry.delete(el);
    observer.unobserve(el);
  };
}
