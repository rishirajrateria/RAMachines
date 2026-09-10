/**
 * components/ui/Section.tsx — the standard vertical rhythm block: optional eyebrow +
 * h2 title (with the spark underline accent) + intro paragraph, then children. Set
 * `tight` for smaller top/bottom padding (e.g. stacked sections in a dense page).
 * `tone` (ADR-0002) paints the section as a soft/spark-tinted or dark band instead of
 * plain white — toned sections drop the 1px top divider since the tint itself separates
 * them from their neighbour. `icon` puts an icon beside the eyebrow.
 */
import type { ReactNode } from "react";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import type { IconName } from "./Icons";

const toneClasses: Record<"plain" | "soft" | "spark" | "dark", string> = {
  plain: "",
  soft: "band-soft",
  spark: "band-spark",
  dark: "band-dark",
};

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
  tone?: "plain" | "soft" | "spark" | "dark";
}) {
  const isToned = tone !== "plain";
  return (
    <section
      id={id}
      className={`${isToned ? "" : "border-t border-grey-200"} ${toneClasses[tone]} ${
        tight ? "section-rhythm-tight" : "section-rhythm"
      } ${className}`.trim()}
    >
      <Container>
        {(eyebrow || title || intro) && (
          <div className="mb-8 md:mb-10">
            <SectionHeading eyebrow={eyebrow} icon={icon} title={title} intro={intro} />
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
