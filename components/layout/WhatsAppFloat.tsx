/**
 * components/layout/WhatsAppFloat.tsx — fixed bottom-right WhatsApp button shown on
 * every page. Server Component (a plain link needs no client JS).
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
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 print:hidden"
    >
      <WhatsApp width={28} height={28} />
    </a>
  );
}
