/**
 * components/ui/Band.tsx — full-width section wrapper. ADR-0005: tinted/dark
 * bands are gone; `tone` is kept for backward compatibility only. "dark" (the
 * old hero/CTA band) now renders a `.glass-strong` panel instead of a dark
 * background — the only dark element on the page is text (ADR-0005 §1).
 */
import type { ReactNode } from "react";
import Container from "./Container";

export default function Band({
  tone = "plain",
  children,
  className = "",
}: {
  /** @deprecated only "dark" still changes rendering (a glass-strong panel) — kept for backward compatibility. */
  tone?: "dark" | "soft" | "spark" | "plain";
  children: ReactNode;
  className?: string;
}) {
  const panelled = tone === "dark";
  return (
    <div className={`section-rhythm ${className}`.trim()}>
      <Container>{panelled ? <div className="glass-strong p-8 md:p-12">{children}</div> : children}</Container>
    </div>
  );
}
