/**
 * components/ui/GlancePanel.tsx — ADR-0005 §5: GlancePanel is retired in favour of
 * FactStrip; this now renders FactStrip so every existing call site (same props:
 * `title`, `facts: {icon, label, value}[]`) keeps compiling and gets the new look.
 */
import FactStrip from "./FactStrip";
import type { IconName } from "./Icons";

export default function GlancePanel({
  title,
  facts,
}: {
  title?: string;
  facts: { icon: IconName; label: string; value: string }[];
}) {
  return <FactStrip title={title} facts={facts.map((f) => ({ label: f.label, value: f.value, icon: f.icon }))} />;
}
