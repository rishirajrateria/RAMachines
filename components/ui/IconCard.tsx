/**
 * components/ui/IconCard.tsx — ADR-0005 §5: a glass card (icon, title, one-line
 * text, optional link). The icon sits in a 44px teal `.glass-pill` circle —
 * `tone` is accepted for backward compatibility ("spark" used to mean the warm
 * accent) but no longer changes colour; every icon renders teal now.
 */
import GlassCard from "./GlassCard";
import { Icon, type IconName } from "./Icons";

export default function IconCard({
  icon,
  title,
  text,
  href,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- accepted for backward compatibility, never rendered (ADR-0005 §4)
  tone: _tone = "steel",
}: {
  icon: IconName;
  title: string;
  text: string;
  href?: string;
  /** @deprecated kept for backward compatibility — every icon renders teal now (ADR-0005 §4). */
  tone?: "steel" | "spark" | "plain";
}) {
  return (
    <GlassCard href={href} className="h-full">
      <span className="glass-pill inline-flex h-11 w-11 items-center justify-center p-0 text-teal">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-grey-600">{text}</p>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
          Learn more
          <Icon name="ArrowRight" size={14} />
        </span>
      )}
    </GlassCard>
  );
}
