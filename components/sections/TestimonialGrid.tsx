/**
 * components/sections/TestimonialGrid.tsx — home page testimonials grid (6 placeholder
 * quotes from data/testimonials.ts). ADR-0002: a quote icon, an initials avatar and a
 * 5-star row on each card.
 */
import { testimonials } from "@/data";
import Avatar from "@/components/ui/Avatar";
import { Quote, Star } from "@/components/ui/Icons";

export default function TestimonialGrid({ limit }: { limit?: number } = {}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(limit ? testimonials.slice(0, limit) : testimonials).map((t) => (
        <figure
          key={`${t.name}-${t.company}`}
          className="card-hover flex h-full flex-col rounded-xl border border-grey-200 bg-white p-5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <Quote width={28} height={28} className="text-spark" />
            <div className="flex gap-0.5 text-spark" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} width={14} height={14} />
              ))}
            </div>
          </div>
          <blockquote className="mt-3 flex-1 text-sm text-grey-700">&ldquo;{t.quote}&rdquo;</blockquote>
          <figcaption className="mt-4 flex items-center gap-3 text-sm">
            <Avatar name={t.name} size={40} />
            <div>
              <span className="block font-semibold text-ink">{t.name}</span>
              <span className="block text-grey-600">
                {t.role}, {t.company}
              </span>
              <span className="block text-grey-400">{t.location}</span>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
