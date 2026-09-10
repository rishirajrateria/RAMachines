/**
 * components/ui/CtaGroup.tsx — the standard CTA row used on product, category and
 * service pages: solid "Request a Quote" (anchors to the page's #quote block by
 * default) plus outlined Call / WhatsApp / Email. Set `showForm` to also reveal an
 * inline QuoteForm behind a native <details> toggle (no extra client state needed here
 * — only QuoteForm itself is a client component).
 */
import { site } from "@/config/site";
import Button from "./Button";
import { Phone, WhatsApp, Mail } from "./Icons";
import QuoteForm from "@/components/forms/QuoteForm";

export default function CtaGroup({
  product,
  context,
  showForm = false,
}: {
  product?: string;
  context?: string;
  showForm?: boolean;
}) {
  const quoteLabel = context ? `Request a quote — ${context}` : "Request a quote";
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Button href="#quote" variant="solid" aria-label={quoteLabel}>
          Request a Quote
        </Button>
        <Button href={site.phoneHref} variant="outline">
          <Phone width={16} height={16} /> Call
        </Button>
        <Button href={site.whatsappHref} variant="outline" external>
          <WhatsApp width={16} height={16} /> WhatsApp
        </Button>
        <Button href={`mailto:${site.email}`} variant="outline">
          <Mail width={16} height={16} /> Email
        </Button>
      </div>
      {showForm && (
        <details className="mt-6 max-w-xl rounded border border-grey-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink">
            Fill form instead
          </summary>
          <div className="mt-4">
            <QuoteForm product={product} />
          </div>
        </details>
      )}
    </div>
  );
}
