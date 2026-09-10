/**
 * components/ui/FeatureGrid.tsx — ADR-0005 §5: a lighter-weight grid of icon +
 * title + text glass cards (spec-group headers, applications lists, "who it's
 * for" blocks). For the heavier clickable card version see IconCard.
 */
import { Icon, type IconName } from "./Icons";

const colClasses: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { icon: IconName; title: string; text: string }[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <div className={`grid gap-5 ${colClasses[columns]}`}>
      {items.map((item) => (
        <div key={item.title} className="glass p-5">
          <span className="glass-pill inline-flex h-10 w-10 items-center justify-center p-0 text-teal">
            <Icon name={item.icon} size={20} />
          </span>
          <h3 className="mt-3 text-base font-semibold text-ink">{item.title}</h3>
          <p className="mt-1.5 text-sm text-grey-600">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
