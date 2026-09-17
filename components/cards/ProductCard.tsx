/**
 * components/cards/ProductCard.tsx — ADR-0005 §5: a glass tile. Artwork area is a
 * soft light form (radial teal→transparent) with the machine render — the
 * underlying WebP already renders that way (scripts/generate-placeholders.mjs).
 *
 * ADR-0008 §3 "Product presentation": the render now sits on a `.pedestal` glow
 * at ~80% of tile width (was ~35%, via `p-6` padding), and lifts 6px on hover
 * with its pedestal glow brightening (`.pedestal`/`.pedestal-render`,
 * app/globals.css — supersedes the old plain `group-hover:-translate-y-1`). The
 * caption block is tighter: `shortDescription`/highlight chips are dropped in
 * favour of the single headline spec value in `.text-stat` (large tabular
 * numerals) beneath the name — `compact` now gates that spec line instead of the
 * description. The footer hairline uses `border-[color:var(--hairline)]` so it
 * retints for free inside a `.band-deep` section.
 */
import Image from "next/image";
import type { Product } from "@/data/types";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";
import GlassCard from "@/components/ui/GlassCard";

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const href = paths.product(product.category, product.slug);
  const image = product.images[0];
  const primarySpec = product.specs[0];

  return (
    <GlassCard
      href={href}
      className="h-full"
      artwork={
        <div className="pedestal relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(15,118,110,0.10),transparent_70%)]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="pedestal-render mx-auto h-full w-4/5 object-contain"
          />
        </div>
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">{product.headline}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
      {!compact && primarySpec && (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span className="text-stat text-ink">{primarySpec.value}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey-500">{primarySpec.label}</span>
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-[color:var(--hairline)] pt-4 text-sm font-semibold text-teal">
        View machine
        <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassCard>
  );
}
