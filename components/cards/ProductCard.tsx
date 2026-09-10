/**
 * components/cards/ProductCard.tsx — product grid/list card used on /products,
 * category pages and "related products" modules.
 */
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";

export default function ProductCard({ product }: { product: Product }) {
  const href = paths.product(product.category, product.slug);
  const image = product.images[0];
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded border border-grey-200 transition-colors hover:border-steel"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-grey-100">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">
          {product.headline}
        </p>
        <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
        <p className="mt-2 text-sm text-grey-600">{product.shortDescription}</p>
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
