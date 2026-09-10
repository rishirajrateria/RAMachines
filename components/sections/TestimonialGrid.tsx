/**
 * components/sections/TestimonialGrid.tsx — ADR-0005 §6: "3 short quotes in one
 * glass strip." One `.glass-strong` panel holding all testimonials in a row
 * (stacked on mobile), each separated by a hairline — no per-card chrome, no
 * star ratings or spark quote marks.
 */
import { testimonials } from "@/data";
import Avatar from "@/components/ui/Avatar";

export default function TestimonialGrid({ limit }: { limit?: number } = {}) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <div className="glass-strong grid gap-8 p-8 sm:grid-cols-2 md:p-10 lg:grid-cols-3">
      {items.map((t, i) => (
        <figure
          key={`${t.name}-${t.company}`}
          className={`flex h-full flex-col ${i > 0 ? "border-t border-[rgba(15,26,26,0.08)] pt-8 sm:border-t-0 sm:pt-0 sm:pl-8 sm:border-l" : ""}`}
        >
          <blockquote className="flex-1 text-sm text-ink/85">&ldquo;{t.quote}&rdquo;</blockquote>
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
