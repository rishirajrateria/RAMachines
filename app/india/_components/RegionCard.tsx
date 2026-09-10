/**
 * app/india/_components/RegionCard.tsx — one region card on the /india hub: icon +
 * region name + a Chips list of every state/UT page in that region. This is the hub's
 * visual replacement for the old plain LinkGrid directory (india worker brief:
 * "region cards — IconCard per region with state Chips inside").
 */
import { Icon, type IconName } from "@/components/ui/Icons";
import Chips from "@/components/ui/Chips";

export default function RegionCard({
  icon,
  region,
  states,
}: {
  icon: IconName;
  region: string;
  states: { name: string; href: string }[];
}) {
  return (
    <div className="card-hover h-full rounded-xl border border-grey-200 bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-steel-soft text-steel">
          <Icon name={icon} size={22} />
        </span>
        <div>
          <h3 className="font-display text-lg text-ink">{region} India</h3>
          <p className="text-xs text-grey-500">
            {states.length} state{states.length === 1 ? "" : "s"} &amp; UTs
          </p>
        </div>
      </div>
      <div className="mt-4">
        <Chips items={states.map((s) => ({ label: s.name, href: s.href }))} />
      </div>
    </div>
  );
}
