/**
 * components/ui/Avatar.tsx — initials in a spark-tinted circle, used in place of a real
 * headshot (TestimonialGrid). Purely decorative, so it is aria-hidden.
 */
export default function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "RA";

  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-spark-soft font-display text-spark"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials}
    </span>
  );
}
