/**
 * app/export/IconPanel.tsx — a large icon tile on a tinted background, used as the
 * illustration-style side of an alternating two-column prose block (ADR-0002: pages
 * must be visual first, prose second). We do not own public/** so cannot generate new
 * artwork here; this composes existing Icons.tsx glyphs into a big, tinted panel
 * instead of a plain grey placeholder box.
 */
import { Icon, type IconName } from "@/components/ui/Icons";

export default function IconPanel({
  icon,
  label,
  tone = "soft",
}: {
  icon: IconName;
  label: string;
  tone?: "soft" | "spark";
}) {
  const bg = tone === "spark" ? "bg-spark-soft" : "bg-steel-soft";
  const fg = tone === "spark" ? "text-spark" : "text-steel";
  return (
    <div className={`flex h-full min-h-[220px] flex-col items-center justify-center gap-4 rounded-xl ${bg} p-8 text-center`}>
      <span className={`flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-card ${fg}`}>
        <Icon name={icon} size={32} />
      </span>
      <p className="font-display text-lg text-ink">{label}</p>
    </div>
  );
}
