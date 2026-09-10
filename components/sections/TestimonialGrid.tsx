/**
 * components/sections/TestimonialGrid.tsx — home page testimonials grid (6 placeholder
 * quotes from data/testimonials.ts).
 */
import { testimonials } from "@/data";

export default function TestimonialGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <figure key={`${t.name}-${t.company}`} className="rounded border border-grey-200 p-5">
          <blockquote className="text-sm text-grey-700">&ldquo;{t.quote}&rdquo;</blockquote>
          <figcaption className="mt-4 text-sm">
            <span className="block font-semibold text-ink">{t.name}</span>
            <span className="block text-grey-600">
              {t.role}, {t.company}
            </span>
            <span className="block text-grey-400">{t.location}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
