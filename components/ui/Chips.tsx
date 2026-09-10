/**
 * components/ui/Chips.tsx — ADR-0005 §5: small glass pills (`.chip`, 34px tall).
 * Used sparingly — max one row per page section. Renders a link chip when `href`
 * is given, a static chip otherwise.
 */
import Link from "next/link";
import { Icon, type IconName } from "./Icons";

export default function Chips({
  items,
}: {
  items: { label: string; href?: string; icon?: IconName }[];
}) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const content = (
          <>
            {item.icon && <Icon name={item.icon} size={16} />}
            {item.label}
          </>
        );
        return (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className="chip">
                {content}
              </Link>
            ) : (
              <span className="chip">{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
