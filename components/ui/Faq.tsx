/**
 * components/ui/Faq.tsx — accordion built from native <details>/<summary> (no client
 * JS). `name` groups the <details> elements so only one stays open at a time in browsers
 * that support the shared "name" attribute; falls back gracefully elsewhere. Emits
 * FAQPage JSON-LD alongside the visible markup.
 */
import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/schema";
import type { FaqItem } from "@/data/types";

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
      {title && <h2 className="mb-6 font-display text-display-md text-ink">{title}</h2>}
      <div className="divide-y divide-grey-200 border-t border-grey-200">
        {items.map((item) => (
          <details key={item.q} name={`${id}-accordion`} className="group py-4">
            <summary>
              <h3 className="inline text-base font-semibold text-ink">{item.q}</h3>
            </summary>
            <p className="mt-3 max-w-prose text-grey-600">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </div>
  );
}
