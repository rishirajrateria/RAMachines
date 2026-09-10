/**
 * components/ui/SectionHeading.tsx — eyebrow (with optional icon) + h2 with the
 * teal→spark gradient underline accent + optional intro paragraph. Used inside
 * Section/Band bodies and anywhere a page needs the standard heading block without
 * the divider Section adds.
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
      {title && (
        <h2 className={`section-title text-display-md ${centered ? "section-title--center" : ""}`.trim()}>
          {title}
        </h2>
      )}
      {intro && <p className="mt-3 text-grey-600">{intro}</p>}
    </div>
  );
}
