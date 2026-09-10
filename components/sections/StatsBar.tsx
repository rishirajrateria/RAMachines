/**
 * components/sections/StatsBar.tsx — the trust bar of placeholder stats from
 * config/site.ts (§1 "Company stats"). Renders as a simple divided row.
 */
import { site } from "@/config/site";

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-grey-200 border border-grey-200 sm:grid-cols-4 sm:divide-y-0">
      {site.stats.map((stat) => (
        <div key={stat.label} className="px-4 py-6 text-center sm:px-2">
          <p className="font-display text-display-md text-ink">{stat.value}</p>
          <p className="mt-1 text-xs text-grey-600 sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
