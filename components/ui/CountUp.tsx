"use client";

/**
 * components/ui/CountUp.tsx — ADR-0006 §Motion 5: FactStrip values that parse as a
 * plain number (keeping a trailing "+") count up over 900ms once revealed. Values like
 * "6–8 weeks" or "24/7" never match `NUMERIC` and always render as plain text — use
 * `isCountable` to check before rendering this component. The server (and the initial
 * client render, before hydration effects run) always shows the final value, so there
 * is never a layout shift and no-JS visitors simply see the real number.
 */
import { useEffect, useRef, useState } from "react";
import { parseCountable } from "./isCountable";

const DURATION_MS = 900;

export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    const parsed = parseCountable(value);
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { target, suffix } = parsed;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            setDisplay(`0${suffix}`);

            const tick = (now: number) => {
              const progress = Math.min((now - start) / DURATION_MS, 1);
              const current = Math.round(target * progress);
              setDisplay(`${current.toLocaleString("en-US")}${suffix}`);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
