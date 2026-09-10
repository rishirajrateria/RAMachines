/**
 * components/sections/ContactStrip.tsx — Call / WhatsApp / Email / Hours quick-contact
 * rows, used on the contact page and as a lightweight CTA module elsewhere. ADR-0002:
 * icon-row layout (icon tile beside label + value) rather than stacked icon-over-text.
 */
import { site } from "@/config/site";
import { type IconName, Icon } from "@/components/ui/Icons";

const items: { icon: IconName; label: string; value: string; href?: string; external?: boolean }[] = [
  { icon: "Phone", label: "Call us", value: site.phoneDisplay, href: site.phoneHref },
  { icon: "WhatsApp", label: "WhatsApp", value: site.phoneDisplay, href: site.whatsappHref, external: true },
  { icon: "Mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "Clock", label: "Hours", value: site.hours },
];

export default function ContactStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const body = (
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-steel-soft text-steel">
              <Icon name={item.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-grey-600">
                {item.label}
              </span>
              <span className="block break-words text-sm font-semibold text-ink">{item.value}</span>
            </span>
          </div>
        );
        return (
          <div key={item.label} className="min-w-0 rounded-xl border border-grey-200 bg-white p-4 shadow-card">
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
              body
            )}
          </div>
        );
      })}
    </div>
  );
}
