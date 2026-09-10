/**
 * components/ui/FactStrip.tsx — ADR-0005 §5: one wide glass bar with 3–5 facts
 * (big teal value, small grey label). Replaces GlancePanel and StatsBar — both
 * now render this internally so every existing call site keeps working. `icon`
 * is optional and shown as a small teal glyph above the value when given.
 */
import { Icon, type IconName } from "./Icons";

export default function FactStrip({
  facts,
  title,
}: {
  facts: { label: string; value: string; icon?: IconName }[];
  title?: string;
}) {
  if (!facts.length) return null;
  return (
    <div className="glass p-6 md:p-8">
      {title && <p className="mb-5 text-sm font-semibold text-ink">{title}</p>}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {facts.map((fact) => (
          <div key={fact.label}>
            {fact.icon && (
              <span className="mb-2 inline-flex text-teal">
                <Icon name={fact.icon} size={20} />
              </span>
            )}
            <dd className="font-display text-2xl text-teal md:text-3xl">{fact.value}</dd>
            <dt className="mt-1 text-xs text-grey-600 md:text-sm">{fact.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
