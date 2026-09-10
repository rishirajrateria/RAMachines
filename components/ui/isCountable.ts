/**
 * components/ui/isCountable.ts — the plain (non-client) predicate behind
 * ADR-0006 §Motion 5: which FactStrip values are pure numbers (optionally with a
 * trailing "+") eligible for CountUp's count-up animation, vs. values like
 * "6–8 weeks" or "24/7" that always render as plain text. Kept in its own module
 * (no "use client") so FactStrip — a Server Component — can call it directly;
 * only JSX may cross the server/client boundary into components/ui/CountUp.tsx.
 */
const NUMERIC = /^(\d[\d,]*)(\+)?$/;

export function isCountable(value: string): boolean {
  return NUMERIC.test(value);
}

export function parseCountable(value: string): { target: number; suffix: string } | null {
  const match = value.match(NUMERIC);
  if (!match) return null;
  return { target: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] ?? "" };
}
