/**
 * components/cards/ProductCard.tsx — product grid/list card used on /products,
 * category pages and "related products" modules. ADR-0002: illustration on a tinted
 * background, spec chips (first three highlights) and an arrow CTA on a lifting card.
 */
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";
import Chips from "@/components/ui/Chips";

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const href = paths.product(product.category, product.slug);
  const image = product.images[0];
  return (
    <Link
      href={href}
      className="card-hover group block h-full overflow-hidden rounded-xl border border-grey-200 bg-white shadow-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-steel-soft">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-full w-full object-contain p-4"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">
          {product.headline}
        </p>
        <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
        {!compact && <p className="mt-2 text-sm text-grey-600">{product.shortDescription}</p>}
        {product.highlights.length > 0 && (
          <div className="mt-3">
            <Chips items={product.highlights.slice(0, 3).map((label) => ({ label }))} />
          </div>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
          View machine
          <ArrowRight
            width={14}
            height={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
