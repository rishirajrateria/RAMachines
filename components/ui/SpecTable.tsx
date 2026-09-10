/**
 * components/ui/SpecTable.tsx — ADR-0005 §6: key/value specification table
 * "inside glass" (product spec sheets, materials & thickness tables). No
 * tinted caption band, no icon tile — a plain glass container with hairline
 * row dividers. `icon` is accepted for backward compatibility only.
 */
import type { IconName } from "./Icons";

export default function SpecTable({
  rows,
  caption,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- accepted for backward compatibility, never rendered (ADR-0005 §6)
  icon: _icon,
}: {
  rows: { label: string; value: string }[];
  caption?: string;
  /** @deprecated kept for backward compatibility — SpecTable no longer shows an icon (ADR-0005 §6). */
  icon?: IconName;
}) {
  return (
    <div className="glass overflow-hidden p-0">
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="caption-top border-b border-[rgba(15,26,26,0.08)] px-5 py-3 text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">{caption}</span>
          </caption>
        )}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[rgba(15,26,26,0.08)] last:border-b-0">
              <th scope="row" className="w-2/5 py-3 pl-5 pr-4 text-left align-top font-semibold text-ink">
                {row.label}
              </th>
              <td className="py-3 pr-5 align-top text-grey-700">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
