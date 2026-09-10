/**
 * components/sections/StatsBar.tsx — the trust bar of placeholder stats from
 * config/site.ts (§1 "Company stats"). ADR-0002: big spark display numbers with an
 * icon per stat. config/site.ts is read-only (ADR-0001 §4) and carries no icon field,
 * so the label text is matched against a small local map instead.
 */
import { site } from "@/config/site";
import { Icon, type IconName } from "@/components/ui/Icons";

const iconFor = (label: string): IconName => {
  const l = label.toLowerCase();
  if (l.includes("machine")) return "Factory";
  if (l.includes("countr")) return "Globe";
  if (l.includes("year")) return "Clock";
  if (l.includes("operator") || l.includes("train")) return "GraduationCap";
  return "Sparkles";
};

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {site.stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-grey-200 bg-white px-4 py-6 text-center shadow-card sm:px-2"
        >
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-spark-soft text-spark">
            <Icon name={iconFor(stat.label)} size={20} />
          </span>
          <p className="text-gradient-teal mt-3 font-display text-display-md">{stat.value}</p>
          <p className="mt-1 text-xs text-grey-600 sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
