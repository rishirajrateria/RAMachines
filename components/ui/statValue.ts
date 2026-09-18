/**
 * components/ui/statValue.ts — typographic handling for spec and fact numerals
 * (`.text-stat`: FactStrip, ProductCard, CategoryCard, the home stats row).
 *
 * The stat scale — clamp(2.5rem, 5vw, 4rem) — was designed for the short values
 * it was introduced with ("1989", "20+", "25+"). Product specs reuse the same
 * slot for much longer strings, and at 64px they broke apart: "1500 × 3000 mm"
 * wrapped onto four lines, "25" separated from its "mm", "±0.03 mm" split in
 * two. A measurement is unreadable once its number and unit are on different
 * lines, so this fixes both halves of the problem:
 *
 *   `glueUnits`  — binds a number to the unit that follows it, and both sides of
 *                  a "×" in a dimension, with non-breaking spaces, so a value can
 *                  only ever break at a point that still reads correctly
 *                  ("Up to 25 mm carbon steel" may break before "carbon", never
 *                  between "25" and "mm").
 *   `statSize`   — steps the type down as the value gets longer, so a long spec
 *                  is set at a size that actually fits its column instead of
 *                  being forced to wrap.
 */

/** Units that belong to the number in front of them. */
const UNIT = /(\d)\s+([a-zA-Zµ°%][a-zA-Z°µ%/²³]{0,5})(?![\w-])/g;
/** Both sides of a dimension's "×" travel together. */
const TIMES = /(\d)\s*[×x]\s*(\d)/g;

const NBSP = " ";

export function glueUnits(value: string): string {
  return value.replace(TIMES, `$1${NBSP}×${NBSP}$2`).replace(UNIT, `$1${NBSP}$2`);
}

/**
 * The size step for a value, by length. Thresholds are in visible characters —
 * what decides whether it fits, not what it means.
 */
export function statSize(value: string): string {
  const n = value.trim().length;
  if (n <= 6) return "text-stat"; // "1989", "25+", "3 kW"
  if (n <= 12) return "text-stat-md"; // "±0.03 mm", "1.5 × 3 m"
  return "text-stat-sm"; // "1500 × 3000 mm", "Up to 25 mm carbon steel"
}

/**
 * The size step for a GROUP of values shown side by side, chosen from the
 * longest one so they all share it.
 *
 * Sizing each value independently is worse than it sounds: a spec row of
 * "1500 × 3000 mm", "Up to 25 mm carbon steel" and "±0.03 mm" ends up with the
 * short value set half again as large as its neighbours, which reads as a
 * mistake rather than a hierarchy. A row of facts is one object and should be
 * set at one size — the largest that fits all of them.
 */
export function statSizeForGroup(values: string[]): string {
  if (!values.length) return "text-stat";
  const longest = values.reduce((a, b) => (b.trim().length > a.trim().length ? b : a));
  return statSize(longest);
}
