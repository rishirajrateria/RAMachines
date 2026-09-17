/**
 * components/ui/Band.tsx — full-width section wrapper. ADR-0005: tinted/dark
 * bands were gone; `tone` is kept for backward compatibility, and only "dark"
 * still changes rendering. ADR-0008 §3: "dark" now renders a proper deep
 * section — `.band-deep` (ink → teal-deep gradient, full-bleed, faint grain)
 * behind the content, rather than an inset `.glass-strong` panel floating on
 * the plain canvas. Children (FactStrip, GlassCard-based tiles, Chips, Faq, …)
 * supply their own glass surfaces, which `.band-deep` retints for dark —
 * app/globals.css.
 */
import type { ReactNode } from "react";
import Container from "./Container";

export default function Band({
  tone = "plain",
  children,
  className = "",
}: {
  /** @deprecated only "dark" still changes rendering (a `.band-deep` section) — kept for backward compatibility. */
  tone?: "dark" | "soft" | "spark" | "plain";
  children: ReactNode;
  className?: string;
}) {
  const deep = tone === "dark";
  return (
    <div className={`section-rhythm ${deep ? "band-deep grain" : ""} ${className}`.trim()}>
      <Container>{children}</Container>
    </div>
  );
}
