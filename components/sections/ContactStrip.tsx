/**
 * components/sections/ContactStrip.tsx — ADR-0005 §5: Call / WhatsApp / Email /
 * Hours as glass panels, used on the contact page and as a lightweight CTA
 * module elsewhere.
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
            <span className="glass-pill flex h-11 w-11 shrink-0 items-center justify-center p-0 text-teal">
              <Icon name={item.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">{item.label}</span>
              <span className="block break-words text-sm font-semibold text-ink">{item.value}</span>
            </span>
          </div>
        );
        return (
          <div key={item.label} className="glass min-w-0 p-4">
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
