/**
 * app/export/RegionCard.tsx — a world-region card for the /export hub: icon tile,
 * region name, country count and a handful of country chips. Modelled on
 * components/ui/IconCard.tsx's visual language, but IconCard itself has no slot for a
 * chip list, so this is a small local composition rather than a design-system change.
 */
import Chips from "@/components/ui/Chips";
import { Icon, type IconName } from "@/components/ui/Icons";
import { paths } from "@/lib/urls";
import type { Country } from "@/data/types";

const PREVIEW_COUNT = 6;

export default function RegionCard({
  region,
  icon,
  countries,
}: {
  region: string;
  icon: IconName;
  countries: Country[];
}) {
  const preview = countries.slice(0, PREVIEW_COUNT);
  const remaining = countries.length - preview.length;

  return (
    <div className="h-full rounded-xl border border-grey-200 bg-white p-6 shadow-card">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-steel-soft text-steel">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-display text-lg text-ink">{region}</h3>
      <p className="mt-1 text-sm text-grey-600">
        {countries.length} {countries.length === 1 ? "market" : "markets"}
      </p>
      <div className="mt-4">
        <Chips
          items={[
            ...preview.map((c) => ({ label: c.name, href: paths.country(c.slug) })),
            ...(remaining > 0 ? [{ label: `+${remaining} more` }] : []),
          ]}
        />
      </div>
    </div>
  );
}
