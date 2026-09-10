/**
 * components/ui/Faq.tsx — accordion built from native <details>/<summary> (no client
 * JS). `name` groups the <details> elements so only one stays open at a time in browsers
 * that support the shared "name" attribute; falls back gracefully elsewhere. Each item
 * is a rounded card with a small spark question-mark tile beside the question (ADR-0002:
 * "every FAQ group gets an icon"). Emits FAQPage JSON-LD alongside the visible markup.
 */
import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/schema";
import type { FaqItem } from "@/data/types";
import SectionHeading from "./SectionHeading";

export default function Faq({
  items,
  title = "Frequently asked questions",
  id = "faq",
}: {
  items: FaqItem[];
  title?: string;
  id?: string;
}) {
  return (
    <div id={id}>
      {title && (
        <div className="mb-6">
          <SectionHeading eyebrow="FAQ" icon="Sparkles" title={title} />
        </div>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.q} name={`${id}-accordion`} className="rounded-item group">
            <summary>
              <span className="flex items-center gap-3">
                <span className="summary-icon" aria-hidden="true">
                  ?
                </span>
                <h3 className="text-base font-semibold text-ink">{item.q}</h3>
              </span>
            </summary>
            <p className="mt-3 max-w-prose pl-11 text-grey-600">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </div>
  );
}
