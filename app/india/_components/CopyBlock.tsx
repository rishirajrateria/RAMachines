/**
 * app/india/_components/CopyBlock.tsx — one alternating two-column block used to lay
 * out the long-form prose composed by lib/copy/state.ts / lib/copy/city.ts: heading +
 * paragraphs (+ optional link chips) on one side, a small visual (icon tile, fact
 * panel or chip list) on the other, flipping sides block to block (ADR-0002: "prose in
 * alternating two-column blocks with an icon column"). Text stays first in document
 * order regardless of visual side, so reading order and SEO text order never change.
 */
import Prose from "@/components/ui/Prose";
import SectionHeading from "@/components/ui/SectionHeading";
import Chips from "@/components/ui/Chips";
import GlancePanel from "@/components/ui/GlancePanel";
import type { IconName } from "@/components/ui/Icons";
import IconTile from "./IconTile";

/** What the secondary column shows. Falls back to a plain icon tile when omitted. */
export type CopyAside =
  | { kind: "icon" }
  | { kind: "facts"; facts: { icon: IconName; label: string; value: string }[] }
  | { kind: "chips"; chips: { label: string; icon?: IconName }[] };

export interface CopySection {
  id: string;
  icon: IconName;
  eyebrow: string;
  h2: string;
  paragraphs: string[];
  list?: { name: string; href: string }[];
  aside?: CopyAside;
}

function AsideContent({ aside, icon }: { aside: CopySection["aside"]; icon: IconName }) {
  if (!aside || aside.kind === "icon") return <IconTile icon={icon} />;
  if (aside.kind === "facts") return <GlancePanel facts={aside.facts} />;
  return (
    <div className="flex h-full flex-col justify-center gap-3 rounded-xl bg-steel-soft p-6">
      <Chips items={aside.chips} />
    </div>
  );
}

export default function CopyBlock({ section, reverse = false }: { section: CopySection; reverse?: boolean }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr] md:gap-10">
      <div className={reverse ? "md:order-2" : "md:order-1"}>
        <SectionHeading eyebrow={section.eyebrow} icon={section.icon} title={section.h2} />
        <Prose className="mt-4">
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Prose>
        {section.list && section.list.length > 0 && (
          <div className="mt-5">
            <Chips items={section.list.map((l) => ({ label: l.name, href: l.href }))} />
          </div>
        )}
      </div>
      <div className={reverse ? "md:order-1" : "md:order-2"}>
        <AsideContent aside={section.aside} icon={section.icon} />
      </div>
    </div>
  );
}
