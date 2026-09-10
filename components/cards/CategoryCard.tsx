/**
 * components/cards/CategoryCard.tsx — ADR-0005 §5: a glass tile with a line-art
 * glyph on a soft light backdrop. `count` is the number of products in the
 * category. ADR-0006 §Polish: the glyph rises 4px on hover and the footer link
 * gets a faint hairline separator above it.
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
        <div className="relative aspect-[3/2] w-full bg-[radial-gradient(circle_at_50%_40%,rgba(15,118,110,0.10),transparent_70%)]">
          <Image
            src={category.image.src}
            alt={category.image.alt}
            width={category.image.width}
            height={category.image.height}
            className="h-full w-full object-contain p-8 transition-transform duration-300 group-hover:-translate-y-1"
          />
        </div>
      }
    >
      <h3 className="font-display text-lg text-ink">{category.name}</h3>
      <p className="mt-2 text-sm text-grey-600">{category.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-[rgba(15,26,26,0.08)] pt-4 text-sm font-semibold text-teal">
        {count} {count === 1 ? "machine" : "machines"}
        <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassCard>
  );
}
