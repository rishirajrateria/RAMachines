/**
 * components/ui/Faq.tsx — ADR-0005 §5: glass accordion, hairline separators,
 * plus/minus icon, one open at a time. Built from native <details>/<summary> (no
 * client JS); `name` groups the <details> elements so only one stays open at a
 * time in browsers that support the shared "name" attribute. Emits FAQPage
 * JSON-LD alongside the visible markup.
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
          <SectionHeading eyebrow="FAQ" title={title} />
        </div>
      )}
      <div className="glass px-6 md:px-8">
        {items.map((item) => (
          <details key={item.q} name={`${id}-accordion`} className="glass-accordion-item">
            <summary>
              <h3 className="text-base font-semibold text-ink">{item.q}</h3>
              <span className="accordion-toggle" aria-hidden="true" />
            </summary>
            <p className="mt-3 max-w-prose text-grey-600">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </div>
  );
}
