/**
 * app/products/ProductTile.tsx — the calm product tile used on the products index,
 * category pages and a product's "related machines" section: line-art glyph, name,
 * headline and an arrow — nothing else (ADR-0005 §6: no chip row, no repeated
 * description on tiles). Deliberately lighter than components/cards/ProductCard.tsx
 * (which also shows a description and a highlights chip row) since none of those
 * three call sites want that extra content per the page anatomy.
 */
import Image from "next/image";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";
import GlassCard from "@/components/ui/GlassCard";

export default function ProductTile({ product }: { product: Product }) {
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
            className="h-full w-full object-contain p-6"
          />
        </div>
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">{product.headline}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
        View machine
        <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassCard>
  );
}
