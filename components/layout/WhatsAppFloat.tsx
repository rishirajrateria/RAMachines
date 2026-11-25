/**
 * components/layout/WhatsAppFloat.tsx — ADR-0005 §5: a solid WhatsApp-green
 * circle with a white icon, pinned bottom-right on every page (`.wa-float` in
 * globals.css sets `position: fixed`; the glass classes set `position: relative`
 * and used to win, leaving the button stranded in the footer). Server Component (a plain link needs no client JS,
 * including the CSS-only pulse ring below — ADR-0006 §Polish: a soft green ring
 * pulse, 2s loop, subtle, fully off under prefers-reduced-motion).
 */
import { site } from "@/config/site";
import { WhatsApp } from "@/components/ui/Icons";

export default function WhatsAppFloat() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-float print:hidden"
    >
      <span className="wa-ring" aria-hidden="true" />
      <WhatsApp width={30} height={30} />
    </a>
  );
}
