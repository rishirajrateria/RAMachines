/**
 * components/ui/Faq.tsx — ADR-0005 §5: glass accordion, hairline separators,
 * plus/minus icon, one open at a time. The FAQPage JSON-LD output is unchanged —
 * same `faqSchema(items)` call, rendered alongside the visible markup.
 *
 * ADR-0009 §3: native `<details name="faq">` (the `name` attribute makes the
 * group mutually exclusive — one open at a time — with zero JS) replaces the old
 * client `useState`/`aria-expanded` accordion. This is now a Server Component:
 * no "use client", no hook, no hydration cost. `.accordion-panel`'s grid-rows
 * open/close animation (app/globals.css) keys off the native `[open]` attribute
 * instead of an `.is-open` class.
 */
import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/schema";
import type { FaqItem } from "@/data/types";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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
          <Reveal as="div" stagger key={item.q} className="glass-accordion-item">
            <details name="faq">
              <summary>
                <span className="text-base font-semibold text-ink">{item.q}</span>
                <span className="accordion-toggle" aria-hidden="true" />
              </summary>
              <div className="accordion-panel">
                <p className="max-w-prose pt-3 text-grey-600">{item.a}</p>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </div>
  );
}
