/**
 * app/services/laser-cutting-job-work/copy.ts — copy for /services/laser-cutting-job-work,
 * kept out of page.tsx so the route file stays under the 400-line limit. This is the only
 * page on the site where the phrase "laser cutting job work" may appear (see ADR §2 and
 * data/faqs.ts); the rest of the site uses the shorter "job work" or avoids the phrase.
 * To edit: change the paragraphs/arrays below directly.
 */
import type { IconName } from "@/components/ui/Icons";

export const introParagraphs: string[] = [
  "RA Machine offers laser cutting job work on our own fiber laser equipment, so you get clean, accurate parts cut to your drawing without the capital cost or floor space a machine of your own would require — suited to prototype runs, short batches, or when your own machine is down or fully booked.",
];

export const materialsParagraph: string =
  "We cut carbon steel, stainless steel, aluminium, brass, copper and galvanised sheet, from thin-gauge sheet up to heavier plate for structural work. Send your material specification with the drawing and we will confirm feasibility as part of the quotation.";

export const formatsParagraph: string =
  "DXF and DWG import directly into our nesting software for the fastest, most accurate quotation. We also accept PDF drawings or clear scanned sketches for simpler geometry, which our team can redraw where needed.";

export const turnaroundParagraph: string =
  "Most orders are completed within a few working days of drawing approval, with a firm delivery date confirmed in writing at the quotation stage. Larger or more complex batches are scheduled against an agreed date upfront.";

export const quoteIntro: string =
  "Send your drawing, material, thickness and quantity using the form below, and we will revert with feasibility, price and turnaround.";

/* --------------------------- ADR-0002 visual additions --------------------------- */
// Purely presentational metadata — icons, short chip/step labels — layered on top of
// the copy above (page.tsx). No paragraph text is added, removed or reworded here.

export const heroLead: string =
  "Clean, accurate parts cut to your drawing on our own fiber laser equipment — no machine purchase, floor space or in-house expertise required.";

export const heroChips: { label: string; icon: IconName }[] = [
  { label: "DXF / DWG accepted", icon: "Layers" },
  { label: "Feasibility & price first", icon: "Currency" },
  { label: "Few working days", icon: "Clock" },
  { label: "Prototype to batch", icon: "Package" },
];
