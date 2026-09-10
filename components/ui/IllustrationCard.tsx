/**
 * components/ui/IllustrationCard.tsx — a bigger illustrated card (India/world reach,
 * about highlights): tinted image panel, optional badge, title, text and an arrow CTA.
 * The whole card is a single link.
 */
import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/data/types";
import { ArrowRight } from "./Icons";

export default function IllustrationCard({
  image,
  title,
  text,
  href,
  badge,
}: {
  image: Img;
  title: string;
  text: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="card-hover group block overflow-hidden rounded-xl border border-grey-200 bg-white shadow-card"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-steel-soft">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-full w-full object-cover"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-card">
            {badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-ink">{title}</h3>
        <p className="mt-2 text-sm text-grey-600">{text}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
          Learn more
          <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
