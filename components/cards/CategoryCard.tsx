/**
 * components/cards/CategoryCard.tsx — category grid card used on the home page and
 * /products. `count` is the number of products in the category.
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
      className="group block overflow-hidden rounded border border-grey-200 transition-colors hover:border-steel"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-grey-100">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          width={category.image.width}
          height={category.image.height}
          className="h-full w-full object-cover"
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
