/**
 * components/cards/CategoryCard.tsx — category grid card used on the home page and
 * /products. `count` is the number of products in the category. ADR-0002: illustration
 * on a tinted background and a lifting card shadow.
 */
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";

export default function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link
      href={paths.category(category.slug)}
      className="card-hover group block h-full overflow-hidden rounded-xl border border-grey-200 bg-white shadow-card"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-spark-soft">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          width={category.image.width}
          height={category.image.height}
          className="h-full w-full object-contain p-6"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-ink">{category.name}</h3>
        <p className="mt-2 text-sm text-grey-600">{category.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
          {count} {count === 1 ? "machine" : "machines"}
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
