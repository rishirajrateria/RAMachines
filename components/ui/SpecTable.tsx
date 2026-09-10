/**
 * components/ui/SpecTable.tsx — key/value specification table (product specs, materials
 * & thickness tables). Rounded container, zebra rows, and an optional group icon beside
 * the caption (ADR-0002: "every spec group gets an icon").
 */
import { Icon, type IconName } from "./Icons";

export default function SpecTable({
  rows,
  caption,
  icon,
}: {
  rows: { label: string; value: string }[];
  caption?: string;
  icon?: IconName;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-grey-200">
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="caption-top border-b border-grey-200 bg-steel-soft px-4 py-3 text-left">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel">
              {icon && <Icon name={icon} size={16} />}
              {caption}
            </span>
          </caption>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 1 ? "bg-grey-50" : "bg-white"}>
              <th scope="row" className="w-2/5 py-3 pl-4 pr-4 text-left align-top font-semibold text-ink">
                {row.label}
              </th>
              <td className="py-3 pr-4 align-top text-grey-700">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
