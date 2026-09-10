/**
 * components/cards/ProductCard.tsx — ADR-0005 §5: a glass tile. Artwork area is a
 * soft light form (radial teal→transparent) with a line-art glyph of the machine
 * — the underlying WebP already renders that way (scripts/generate-placeholders.mjs),
 * so this just drops it on a calm teal-tinted backdrop instead of a hard-edged panel.
 * ADR-0006 §Polish: the glyph rises 4px on hover and the footer link gets a faint
 * hairline separator above it.
 */
import Image from "next/image";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";
import Chips from "@/components/ui/Chips";
import GlassCard from "@/components/ui/GlassCard";

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const href = paths.product(product.category, product.slug);
  const image = product.images[0];
  return (
    <GlassCard
      href={href}
      className="h-full"
      artwork={
        <div className="relative aspect-[4/3] w-full bg-[radial-gradient(circle_at_50%_40%,rgba(15,118,110,0.10),transparent_70%)]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:-translate-y-1"
          />
        </div>
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">{product.headline}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
      {!compact && <p className="mt-2 text-sm text-grey-600">{product.shortDescription}</p>}
      {product.highlights.length > 0 && (
        <div className="mt-3">
          <Chips items={product.highlights.slice(0, 3).map((label) => ({ label }))} />
        </div>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-[rgba(15,26,26,0.08)] pt-4 text-sm font-semibold text-teal">
        View machine
        <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassCard>
  );
}
