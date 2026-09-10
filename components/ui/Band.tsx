/**
 * components/ui/Band.tsx — full-width tonal section wrapper (dark hero/CTA band, soft
 * tinted band, spark-tinted band, or a plain white section). Pairs with .band-dark /
 * .band-soft / .band-spark in app/globals.css. Consistent section-rhythm padding.
 */
import type { ReactNode } from "react";
import Container from "./Container";

const toneClasses: Record<"dark" | "soft" | "spark" | "plain", string> = {
  dark: "band-dark",
  soft: "band-soft",
  spark: "band-spark",
  plain: "bg-white",
};

export default function Band({
  tone = "plain",
  children,
  className = "",
}: {
  tone?: "dark" | "soft" | "spark" | "plain";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-rhythm ${toneClasses[tone]} ${className}`.trim()}>
      <Container>{children}</Container>
    </div>
  );
}
