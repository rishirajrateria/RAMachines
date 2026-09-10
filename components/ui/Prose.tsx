/**
 * components/ui/Prose.tsx — typographic wrapper for long-form copy (state/city/country
 * pages, about, repair, etc). Pairs with the `.prose` rules in app/globals.css.
 */
import type { ReactNode } from "react";

export default function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`prose ${className}`.trim()}>{children}</div>;
}
