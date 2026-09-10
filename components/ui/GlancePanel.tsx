/**
 * components/ui/GlancePanel.tsx — the "At a glance" tinted fact panel (industries,
 * delivery time, service, training, voltage/ports on export pages…) that ADR-0002 asks
 * for near the top of every page, so the top of the page is visual rather than text.
 */
import { Icon, type IconName } from "./Icons";

export default function GlancePanel({
  title,
  facts,
}: {
  title?: string;
  facts: { icon: IconName; label: string; value: string }[];
}) {
  return (
    <div className="panel-soft rounded-xl p-6">
      {title && <h3 className="font-display text-lg text-ink">{title}</h3>}
      <dl className={`grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 ${title ? "mt-4" : ""}`.trim()}>
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-steel shadow-card">
              <Icon name={fact.icon} size={18} />
            </span>
            <div>
              <dt className="text-xs text-grey-600">{fact.label}</dt>
              <dd className="text-sm font-semibold text-ink">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
