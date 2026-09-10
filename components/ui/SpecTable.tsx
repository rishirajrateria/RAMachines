/**
 * components/ui/SpecTable.tsx — key/value specification table (product specs, materials
 * & thickness tables). Zebra-free, 1px grey dividers, caption for accessible context.
 */
export default function SpecTable({
  rows,
  caption,
}: {
  rows: { label: string; value: string }[];
  caption?: string;
}) {
  return (
    <table className="w-full border-collapse text-sm">
      {caption && <caption className="mb-2 text-left text-xs text-grey-500">{caption}</caption>}
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-grey-200">
            <th
              scope="row"
              className="w-2/5 py-3 pr-4 text-left align-top font-semibold text-ink"
            >
              {row.label}
            </th>
            <td className="py-3 align-top text-grey-700">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
