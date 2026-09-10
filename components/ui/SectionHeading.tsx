/**
 * components/ui/SectionHeading.tsx — ADR-0005 §3, §5: eyebrow (teal, optional
 * icon) + a calm, plain h2 (no underline bar, no gradient) + optional intro
 * paragraph in grey-600. Used inside Section/Band bodies and anywhere a page
 * needs the standard heading block.
 */
import { Icon, type IconName } from "./Icons";

export default function SectionHeading({
  eyebrow,
  icon,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  icon?: IconName;
  title?: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={`max-w-prose ${centered ? "mx-auto text-center" : ""}`.trim()}>
      {eyebrow && (
        <p className="eyebrow mb-3">
          {icon && <Icon name={icon} size={16} />}
          {eyebrow}
        </p>
      )}
      {title && <h2 className="section-title text-display-md">{title}</h2>}
      {intro && <p className="mt-3 text-grey-600">{intro}</p>}
    </div>
  );
}
