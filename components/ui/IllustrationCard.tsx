/**
 * components/ui/IllustrationCard.tsx — ADR-0005 §5: a bigger glass card (India/
 * world reach, about highlights): image panel, optional badge, title, text and a
 * teal arrow link. The whole card is a single link.
 */
import Image from "next/image";
import type { Img } from "@/data/types";
import { ArrowRight } from "./Icons";
import GlassCard from "./GlassCard";

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
    <GlassCard
      href={href}
      artwork={
        <div className="relative aspect-[16/10] w-full">
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-full w-full object-cover" />
          {badge && (
            <span className="glass-pill absolute left-3 top-3 text-xs font-semibold text-ink">{badge}</span>
          )}
        </div>
      }
    >
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-grey-600">{text}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
        Learn more
        <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassCard>
  );
}
