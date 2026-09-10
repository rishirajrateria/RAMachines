"use client";

/**
 * components/ui/Reveal.tsx — ADR-0006 §Motion 1: scroll reveal wrapper. Server-render
 * is always fully visible (no-JS = visible): the hidden initial state only applies
 * once `app/layout.tsx`'s inline script adds a `js` class to <html>, and only under
 * `prefers-reduced-motion: no-preference` (see `.js .reveal` in app/globals.css) — so
 * reduced-motion visitors never see opacity/transform change at all, JS or not.
 *
 * `delay` sets a fixed transition-delay (ms) via the `--reveal-delay` custom property.
 * `stagger` marks this instance with `data-stagger` so, when several Reveal siblings
 * sit inside the same parent (a grid of tiles, a row of facts, a list of steps), pure
 * CSS `:nth-child` rules give each an increasing delay — 60ms steps, capped at the 6th
 * child (see `.js [data-stagger]:nth-child(n)` in app/globals.css). An explicit `delay`
 * always wins over the computed stagger delay (inline style beats the stylesheet rule).
 *
 * `as` picks the rendered element ("div" default, "li" for list items) so Reveal can
 * be the actual list/section node instead of adding an extra wrapper (no CLS, no
 * incidental layout changes from a spare block box).
 */
import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "./useReveal";

type RevealStyle = CSSProperties & { "--reveal-delay"?: string };

export default function Reveal({
  children,
  as = "div",
  delay,
  stagger = false,
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "li";
  delay?: number;
  stagger?: boolean;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const classes = `reveal ${className}`.trim();
  const style: RevealStyle | undefined = delay !== undefined ? { "--reveal-delay": `${delay}ms` } : undefined;
  const staggerProps = stagger ? { "data-stagger": "" } : {};

  if (as === "li") {
    return (
      <li ref={ref as unknown as React.Ref<HTMLLIElement>} className={classes} style={style} {...staggerProps}>
        {children}
      </li>
    );
  }

  return (
    <div ref={ref as unknown as React.Ref<HTMLDivElement>} className={classes} style={style} {...staggerProps}>
      {children}
    </div>
  );
}
