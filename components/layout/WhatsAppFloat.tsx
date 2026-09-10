/**
 * components/layout/WhatsAppFloat.tsx — ADR-0005 §5: a glass circle with the
 * WhatsApp icon in WhatsApp green (the only non-teal colour allowed). Fixed
 * bottom-right on every page. Server Component (a plain link needs no client JS).
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
      className="glass-strong glass-hover fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center p-0 text-whatsapp print:hidden"
      style={{ borderRadius: "9999px" }}
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
