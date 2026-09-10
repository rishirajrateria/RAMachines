/**
 * components/ui/CtaGroup.tsx — the standard CTA row used on product, category and
 * service pages: solid "Request a Quote" (anchors to the page's #quote block by
 * default) plus outlined Call / WhatsApp / Email. Set `showForm` to also reveal an
 * inline QuoteForm behind a native <details> toggle (no extra client state needed here
 * — only QuoteForm itself is a client component).
 */
import { site } from "@/config/site";
import Button from "./Button";
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
        <Button href="#quote" variant="solid" icon="ArrowRight" aria-label={quoteLabel}>
          Request a Quote
        </Button>
        <Button href={site.phoneHref} variant="outline" icon="Phone">
          Call
        </Button>
        <Button href={site.whatsappHref} variant="outline" icon="WhatsApp" external>
          WhatsApp
        </Button>
        <Button href={`mailto:${site.email}`} variant="outline" icon="Mail">
          Email
        </Button>
      </div>
      {showForm && (
        <details className="rounded-item mt-6 max-w-xl">
          <summary>
            <span className="flex items-center gap-3">
              <span className="summary-icon" aria-hidden="true">
                +
              </span>
              <span className="text-sm font-semibold text-ink">Fill form instead</span>
            </span>
          </summary>
          <div className="mt-4 pl-11">
            <QuoteForm product={product} />
          </div>
        </details>
      )}
    </div>
  );
}
