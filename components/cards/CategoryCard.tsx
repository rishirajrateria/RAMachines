/**
 * components/cards/CategoryCard.tsx — ADR-0005 §5: a glass tile with the category's
 * machine render on a soft light backdrop. `count` is the number of products in
 * the category.
 *
 * ADR-0008 §3 "Product presentation": the render sits on a `.pedestal` glow at
 * ~80% of tile width (was ~35%, via `p-8` padding), and lifts 6px on hover with
 * its pedestal glow brightening (`.pedestal`/`.pedestal-render`, app/globals.css).
 * Caption is tighter (description trimmed to two lines); the footer count reads
 * as a `.text-stat` numeral instead of plain text, and its hairline uses
 * `border-[color:var(--hairline)]` so it retints for free inside a `.band-deep`
 * section.
 */
import Image from "next/image";
import type { Category } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";
import GlassCard from "@/components/ui/GlassCard";

export default function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <GlassCard
      href={paths.category(category.slug)}
      className="h-full"
      artwork={
        <div className="pedestal relative aspect-[3/2] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(15,118,110,0.10),transparent_70%)]">
          <Image
            src={category.image.src}
            alt={category.image.alt}
            width={category.image.width}
            height={category.image.height}
            className="pedestal-render mx-auto h-full w-4/5 object-contain"
          />
        </div>
      }
    >
      <h3 className="font-display text-lg text-ink">{category.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-grey-600">{category.description}</p>
      <span className="mt-4 flex items-center justify-between gap-2 border-t border-[color:var(--hairline)] pt-4">
        <span className="flex items-baseline gap-1.5">
          <span className="text-stat text-ink">{count}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey-500">
            {count === 1 ? "machine" : "machines"}
          </span>
        </span>
        <ArrowRight width={14} height={14} className="text-teal transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassCard>
  );
}
