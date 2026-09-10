/**
 * components/sections/ContactStrip.tsx — Call / WhatsApp / Email quick-contact cards,
 * used on the contact page and as a lightweight CTA module elsewhere.
 */
import { site } from "@/config/site";
import { Phone, WhatsApp, Mail, Clock } from "@/components/ui/Icons";

const items = [
  { icon: Phone, label: "Call us", value: site.phoneDisplay, href: site.phoneHref, external: false },
  { icon: WhatsApp, label: "WhatsApp", value: site.phoneDisplay, href: site.whatsappHref, external: true },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  { icon: Clock, label: "Hours", value: site.hours, href: undefined, external: false },
];

export default function ContactStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const body = (
          <>
            <Icon width={20} height={20} className="text-steel" />
            <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">
              {item.label}
            </span>
            <span className="mt-1 block text-sm font-semibold text-ink">{item.value}</span>
          </>
        );
        return (
          <div key={item.label} className="rounded border border-grey-200 p-5">
            {item.href ? (
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="block"
              >
                {body}
              </a>
            ) : (
              <div>{body}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
