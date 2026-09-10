/**
 * components/ui/Section.tsx — the standard vertical rhythm block: optional eyebrow
 * + h2 title + intro paragraph, then children. Set `tight` for smaller top/bottom
 * padding. ADR-0005: tinted/dark bands are gone — every section renders on the
 * plain ambient-light canvas; `tone` is kept for backward compatibility (pages
 * still pass "soft"/"spark"/"dark") but only "dark" now does anything visible —
 * it wraps the body in a `.glass-strong` panel so the section still reads as a
 * distinct, elevated block without ever going to a dark background.
 */
import type { ReactNode } from "react";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import type { IconName } from "./Icons";

export default function Section({
  id,
  eyebrow,
  icon,
  title,
  intro,
  children,
  className = "",
  tight = false,
  tone = "plain",
}: {
  id?: string;
  eyebrow?: string;
  icon?: IconName;
  title?: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  tight?: boolean;
  /** @deprecated only "dark" still changes rendering (a glass-strong panel) — kept for backward compatibility. */
  tone?: "plain" | "soft" | "spark" | "dark";
}) {
  const panelled = tone === "dark";
  const body = panelled ? <div className="glass-strong p-8 md:p-12">{children}</div> : children;

  return (
    <section id={id} className={`${tight ? "section-rhythm-tight" : "section-rhythm"} ${className}`.trim()}>
      <Container>
        {(eyebrow || title || intro) && (
          <div className="mb-8 md:mb-10">
            <SectionHeading eyebrow={eyebrow} icon={icon} title={title} intro={intro} />
          </div>
        )}
        {body}
      </Container>
    </section>
  );
}
