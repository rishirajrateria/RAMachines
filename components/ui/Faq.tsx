"use client";

/**
 * components/ui/Faq.tsx — ADR-0005 §5: glass accordion, hairline separators,
 * plus/minus icon, one open at a time. ADR-0006 §Motion 6: a client accordion
 * (button + region, aria-expanded/aria-controls) with a CSS grid-rows open/close
 * animation (300ms) and the plus rotating to a minus; only one item open at a
 * time. Items also reveal on scroll, staggered (`data-stagger`, 60ms steps). The
 * FAQPage JSON-LD output is unchanged — same `faqSchema(items)` call, rendered
 * alongside the (now interactive) visible markup.
 */
import { useId, useState } from "react";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div id={id}>
      {title && (
        <div className="mb-6">
          <SectionHeading eyebrow="FAQ" title={title} />
        </div>
      )}
      <div className="glass px-6 md:px-8">
        {items.map((item, i) => {
          const open = openIndex === i;
          const buttonId = `${baseId}-faq-button-${i}`;
          const panelId = `${baseId}-faq-panel-${i}`;
          return (
            <Reveal as="div" stagger key={item.q} className="glass-accordion-item">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-1 text-left"
                >
                  <span className="text-base font-semibold text-ink">{item.q}</span>
                  <span className={`accordion-toggle ${open ? "is-open" : ""}`.trim()} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} className={`accordion-panel ${open ? "is-open" : ""}`.trim()}>
                <p className="max-w-prose pt-3 text-grey-600">{item.a}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      <JsonLd data={faqSchema(items)} />
    </div>
  );
}
