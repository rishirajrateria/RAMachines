/**
 * components/ui/BentoTile.tsx — ADR-0008 §3: one cell of `BentoGrid`. `span="feature"`
 * spans 2 columns × 2 rows on lg (a large render + big spec numerals); the default
 * `span="normal"` is a single 1×1 cell. Below lg the feature tile spans both columns
 * (still 1 row — see the sm:col-span-2 fallback); on mobile every tile stacks full-width.
 * A tile is a flex column filling its grid cell (`h-full`) so a `GlassCard`/`ProductCard`
 * placed inside with `className="h-full"` fills it edge to edge.
 */
import type { ReactNode } from "react";

export default function BentoTile({
  span = "normal",
  children,
  className = "",
}: {
  span?: "feature" | "normal";
  children: ReactNode;
  className?: string;
}) {
  const spanClasses = span === "feature" ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "";
  return <div className={`flex h-full flex-col ${spanClasses} ${className}`.trim()}>{children}</div>;
}
