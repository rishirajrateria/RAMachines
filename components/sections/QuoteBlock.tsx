/**
 * components/sections/QuoteBlock.tsx — ADR-0005 §5: the quote card on
 * machine-family pages (SPEC §2) as a glass panel — Call/WhatsApp/Email glass
 * pill rows plus a "Fill form instead" toggle that reveals QuoteForm with the
 * family pre-filled. Set `sticky` to pin it on large screens.
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { Phone, WhatsApp, Mail } from "@/components/ui/Icons";
import QuoteForm from "@/components/forms/QuoteForm";
import type { Category } from "@/data/types";

export default function QuoteBlock({
  family,
  country,
  sticky = false,
}: {
  family?: Category;
  country?: string;
  sticky?: boolean;
}) {
  return (
    <div id="quote" className={`glass p-6 ${sticky ? "lg:sticky lg:top-24" : ""}`.trim()}>
      <h2 className="font-display text-lg text-ink">Request a Quote</h2>
      {family && (
        <p className="mt-1 text-sm text-grey-600">
          For <span className="font-semibold text-ink">{family.name}</span>. Each machine is
          configured to the job, so tell us your material, thickness and volume and we will specify and quote it.
        </p>
      )}
      <div className="mt-4 grid gap-2">
        <a href={site.phoneHref} className="glass-pill flex h-11 items-center gap-2 text-sm font-semibold text-ink">
          <Phone width={16} height={16} className="text-teal" /> {site.phoneDisplay}
        </a>
        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill flex h-11 items-center gap-2 text-sm font-semibold text-ink"
        >
          <WhatsApp width={16} height={16} className="text-teal" /> WhatsApp us
        </a>
        <a href={`mailto:${site.email}`} className="glass-pill flex h-11 items-center gap-2 text-sm font-semibold text-ink">
          <Mail width={16} height={16} className="text-teal" /> {site.email}
        </a>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-teal">Fill form instead</summary>
        <div className="mt-4">
          <QuoteForm
            product={family?.name}
            country={country}
            redirectPath={family ? paths.category(family.slug) : undefined}
          />
        </div>
      </details>
    </div>
  );
}
