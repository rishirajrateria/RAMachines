/**
 * app/products/[category]/LongCopySections.tsx — renders a category's `longCopy`
 * (350–500 words per ADR-0003) as 2–3 alternating two-column blocks instead of one
 * long wall of text (ADR-0002), each with a SectionHeading and a supporting visual
 * (the category illustration, or the "at a glance" facts again as a reminder panel
 * further down the page).
 */
import Image from "next/image";
import type { Category } from "@/data/types";
import Prose from "@/components/ui/Prose";
import SectionHeading from "@/components/ui/SectionHeading";
import GlancePanel from "@/components/ui/GlancePanel";
import type { IconName } from "@/components/ui/Icons";
import { categoryGlance } from "./glance";

function chunk<T>(items: T[], parts: number): T[][] {
  if (items.length === 0) return [];
  const size = Math.ceil(items.length / parts);
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

const blockMeta: { eyebrow: string; icon: IconName; title: string }[] = [
  { eyebrow: "How it works", icon: "Gear", title: "The engineering behind the range" },
  { eyebrow: "Choosing a machine", icon: "Gauge", title: "Matching a machine to your job" },
  { eyebrow: "Running the machine", icon: "Shield", title: "Materials, running cost & support" },
];

export default function LongCopySections({ category }: { category: Category }) {
  const groups = chunk(category.longCopy, Math.min(3, category.longCopy.length || 1));
  const facts = categoryGlance[category.slug];

  return (
    <div className="space-y-16 md:space-y-20">
      {groups.map((paragraphs, i) => {
        const meta = blockMeta[i % blockMeta.length];
        const showImage = i === 1;
        return (
          <div key={meta.title} className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className={showImage ? "lg:order-2" : "lg:order-1"}>
              <SectionHeading eyebrow={meta.eyebrow} icon={meta.icon} title={meta.title} />
              <Prose className="mt-5">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Prose>
            </div>
            <div className={`lg:pt-1 ${showImage ? "lg:order-1" : "lg:order-2"}`}>
              {showImage ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-steel-soft">
                  <Image
                    src={category.image.src}
                    alt={category.image.alt}
                    width={category.image.width}
                    height={category.image.height}
                    className="h-full w-full object-contain p-8"
                  />
                </div>
              ) : (
                <GlancePanel title={`${category.shortName} at a glance`} facts={facts} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
