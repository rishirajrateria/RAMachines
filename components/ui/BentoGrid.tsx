/**
 * components/ui/BentoGrid.tsx — ADR-0008 §3: the asymmetric "bento" grid for the
 * home "Machines" section (and anywhere else an uneven, editorial grid fits) —
 * replaces four equal-size cards. Pair with `BentoTile` (`span="feature"` for the
 * one large tile, default `span="normal"` for the rest); `grid-flow-row-dense`
 * lets normal tiles auto-fill the cells the feature tile doesn't span, in
 * document order, so callers don't have to hand-place every tile.
 *
 * lg: 4 columns, fixed-height rows (a `BentoTile span="feature"` spans 2×2 —
 * see BentoTile.tsx). Below lg: 2 columns. Mobile: stacks to a single column.
 */
import type { ReactNode } from "react";

export default function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[15rem] lg:grid-flow-row-dense lg:gap-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
