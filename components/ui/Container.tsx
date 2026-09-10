/**
 * components/ui/Container.tsx — the site's max-width wrapper (1280px, gutter padding).
 * Wrap page-level content in this once per Section rather than nesting it repeatedly.
 */
import type { ReactNode } from "react";

export default function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`container-site ${className}`.trim()}>{children}</div>;
}
