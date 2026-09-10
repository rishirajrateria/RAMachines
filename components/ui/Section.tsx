/**
 * components/ui/Section.tsx — the standard vertical rhythm block: optional eyebrow +
 * h2 title + intro paragraph, a 1px top divider, and consistent vertical padding.
 * Set `tight` for smaller top/bottom padding (e.g. stacked sections in a dense page).
 */
import type { ReactNode } from "react";
import Container from "./Container";

export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  tight = false,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`border-t border-grey-200 ${tight ? "py-10 md:py-14" : "py-14 md:py-20"} ${className}`.trim()}
    >
      <Container>
        {(eyebrow || title || intro) && (
          <div className="mb-8 max-w-prose md:mb-10">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-display-md text-ink">{title}</h2>
            )}
            {intro && <p className="mt-3 text-grey-600">{intro}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
