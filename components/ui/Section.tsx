/**
 * components/ui/Section.tsx — the standard vertical rhythm block: optional eyebrow
 * + h2 title + intro paragraph, then children. Set `tight` for smaller top/bottom
 * padding. `tone` is kept for backward compatibility (pages still pass
 * "soft"/"spark"/"dark") but only "dark" does anything visible. ADR-0008 §3:
 * "dark" now renders a full-bleed `.band-deep` section (ink → teal-deep gradient,
 * faint grain, white heading/body text, glass surfaces retinted for dark) instead
 * of the ADR-0005/0006 inset `.glass-strong` panel — see app/globals.css.
 *
 * ADR-0009 §4: carries `.cv-auto` (`content-visibility: auto` +
 * `contain-intrinsic-size`) — every `Section` below the fold skips layout/paint
 * until it's actually relevant to the user.
 */
import type { ReactNode } from "react";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
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
  /** @deprecated only "dark" still changes rendering (a `.band-deep` section) — kept for backward compatibility. */
  tone?: "plain" | "soft" | "spark" | "dark";
}) {
  const deep = tone === "dark";

  return (
    <section
      id={id}
      className={`cv-auto ${tight ? "section-rhythm-tight" : "section-rhythm"} ${deep ? "band-deep grain" : ""} ${className}`.trim()}
    >
      <Container>
        <Reveal>
          {(eyebrow || title || intro) && (
            <div className="mb-8 md:mb-10">
              <SectionHeading eyebrow={eyebrow} icon={icon} title={title} intro={intro} />
            </div>
          )}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
