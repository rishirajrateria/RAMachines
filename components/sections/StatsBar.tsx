/**
 * components/sections/StatsBar.tsx — ADR-0005 §5: StatsBar is retired in favour
 * of FactStrip; this now renders FactStrip with the company stats from
 * config/site.ts so every existing call site keeps compiling and gets the new
 * "one wide glass bar" look.
 */
import { site } from "@/config/site";
import FactStrip from "@/components/ui/FactStrip";

export default function StatsBar() {
  return <FactStrip facts={site.stats.map((stat) => ({ label: stat.label, value: stat.value }))} />;
}
