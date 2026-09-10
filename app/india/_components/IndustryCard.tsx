/**
 * app/india/_components/IndustryCard.tsx — one card in the "key industries" FeatureGrid
 * on state pages: icon + industry name + one-line note, with a chip per recommended
 * machine linking straight to the product page (ADR-0002 + india worker brief: "industries
 * as FeatureGrid of IconCards, each with its recommended machine chip").
 */
import { Icon, type IconName } from "@/components/ui/Icons";
import Chips from "@/components/ui/Chips";

export default function IndustryCard({
  icon,
  title,
  text,
  machines,
}: {
  icon: IconName;
  title: string;
  text: string;
  machines: { name: string; href: string }[];
}) {
  return (
    <div className="rounded-xl border border-grey-200 bg-white p-5 shadow-card">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-steel-soft text-steel">
        <Icon name={icon} size={20} />
      </span>
      <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-grey-600">{text}</p>
      {machines.length > 0 && (
        <div className="mt-3">
          <Chips items={machines.map((m) => ({ label: m.name, href: m.href, icon: "ArrowRight" as IconName }))} />
        </div>
      )}
    </div>
  );
}
