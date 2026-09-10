/**
 * components/ui/FactStrip.tsx — ADR-0005 §5: one wide glass bar with 3–5 facts
 * (big teal value, small grey label). Replaces GlancePanel and StatsBar — both
 * now render this internally so every existing call site keeps working. `icon`
 * is optional and shown as a small teal glyph above the value when given.
 *
 * ADR-0006 §Motion 1 & 5, §Polish: the strip reveals on scroll and each fact
 * staggers in (`data-stagger`, 60ms steps); values that parse as a plain number
 * (see `isCountable`) count up over 900ms via `CountUp`. Values 34px/600, labels
 * 13px grey, hairline dividers between facts once they sit in a single row (lg+).
 */
import { Icon, type IconName } from "./Icons";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { isCountable } from "./isCountable";

export default function FactStrip({
  facts,
  title,
}: {
  facts: { label: string; value: string; icon?: IconName }[];
  title?: string;
}) {
  if (!facts.length) return null;
  return (
    <Reveal className="glass p-6 md:p-8">
      {title && <p className="mb-5 text-sm font-semibold text-ink">{title}</p>}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:divide-x lg:divide-[rgba(15,26,26,0.08)]">
        {facts.map((fact) => (
          <Reveal as="div" stagger key={fact.label} className="lg:pl-6 lg:first:pl-0">
            {fact.icon && (
              <span className="mb-2 inline-flex text-teal">
                <Icon name={fact.icon} size={20} />
              </span>
            )}
            <dd className="font-display text-2xl text-teal md:text-[34px]">
              {isCountable(fact.value) ? <CountUp value={fact.value} /> : fact.value}
            </dd>
            <dt className="mt-1 text-[13px] text-grey-600">{fact.label}</dt>
          </Reveal>
        ))}
      </dl>
    </Reveal>
  );
}
