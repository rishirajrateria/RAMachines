"use client";

/**
 * components/ui/GlassCard.tsx — ADR-0005 §5: the base card primitive. `.glass`,
 * padding 28px, optional top artwork slot. No hard border, no tinted background,
 * no top-edge accent. Hover lifts 3px with a deeper shadow (`.glass-hover`, disabled
 * under prefers-reduced-motion). Renders a <Link> when `href` is given, a plain <div>
 * otherwise; either way the whole card is the interactive surface.
 *
 * ADR-0006 §Motion 1 & 4: this is one of the components wrapped in scroll-reveal
 * automatically (every GlassCard — and everything built on it: product/category
 * tiles, IconCard, IllustrationCard, CertCard's glass span, Gallery — reveals on
 * scroll with no page-level changes) and carries the pointermove specular sheen
 * (`.glass-sheen`, CSS vars `--mx`/`--my`, mouse only). Both concerns share the
 * same ref/node instead of adding a wrapper element, so there's no extra DOM node
 * and no risk of layout shift.
 *
 * ADR-0009 §3: the sheen no longer attaches its own `pointermove` listener per
 * card — `components/ui/sheen` registers a single delegated listener on
 * `document` the first time any `GlassCard` mounts.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useReveal } from "./useReveal";
import { initGlassSheen } from "./sheen";

export default function GlassCard({
  href,
  artwork,
  strong = false,
  className = "",
  children,
}: {
  href?: string;
  artwork?: ReactNode;
  strong?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useReveal<HTMLElement>();

  useEffect(() => {
    initGlassSheen();
  }, []);

  const surface = strong ? "glass-strong" : "glass";
  const classes = `reveal glass-hover glass-sheen block h-full overflow-hidden ${surface} ${className}`.trim();

  const content = (
    <>
      {artwork && <div className="overflow-hidden rounded-t-[28px]">{artwork}</div>}
      <div className="p-7">{children}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} ref={ref as unknown as React.Ref<HTMLAnchorElement>} className={`group ${classes}`}>
        {content}
      </Link>
    );
  }

  return (
    <div ref={ref as unknown as React.Ref<HTMLDivElement>} className={classes}>
      {content}
    </div>
  );
}
