/**
 * components/ui/GlassCard.tsx — ADR-0005 §5: the base card primitive. `.glass`,
 * padding 28px, optional top artwork slot. No hard border, no tinted background,
 * no top-edge accent; hover lifts 2px with a deeper shadow (`.glass-hover`,
 * disabled under prefers-reduced-motion). Renders a <Link> when `href` is given,
 * a plain <div> otherwise; either way the whole card is the interactive surface.
 */
import type { ReactNode } from "react";
import Link from "next/link";

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
  const surface = strong ? "glass-strong" : "glass";
  const classes = `glass-hover block h-full overflow-hidden ${surface} ${className}`.trim();

  const content = (
    <>
      {artwork && <div className="overflow-hidden rounded-t-[28px]">{artwork}</div>}
      <div className="p-7">{children}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group ${classes}`}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
