/**
 * components/ui/CountUp.tsx — ADR-0006 §Motion 5: FactStrip values that parse as a
 * plain number (keeping a trailing "+") count up over 900ms once revealed. Values like
 * "6–8 weeks" or "24/7" never match `NUMERIC` and always render as plain text — use
 * `isCountable` to check before rendering this component.
 *
 * ADR-0010: a Server Component. The final value is the rendered text, so a
 * visitor without JavaScript (or with reduced motion, or on a save-data
 * connection) simply reads the real number and nothing animates. When
 * public/enhance.js is running it parses that same text, counts up from zero as
 * the element scrolls into view, and restores the exact original string at the
 * end — so the animation can never leave a wrong or reformatted value on screen.
 */
export default function CountUp({ value }: { value: string }) {
  return <span data-countup>{value}</span>;
}
