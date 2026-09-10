/**
 * components/sections/QuoteBlock.tsx — the sticky quote card on product/category pages
 * (SPEC §2): Call/WhatsApp/Email plus a "Fill form" toggle that reveals QuoteForm with
 * the product pre-filled. Set `sticky` to pin it on large screens (product page sidebar).
 */
import { site } from "@/config/site";
import { Phone, WhatsApp, Mail } from "@/components/ui/Icons";
import QuoteForm from "@/components/forms/QuoteForm";
import type { Product } from "@/data/types";

export default function QuoteBlock({
  product,
  country,
  sticky = false,
}: {
  product?: Product;
  country?: string;
  sticky?: boolean;
}) {
  return (
    <div
      id="quote"
      className={`rounded border border-grey-200 p-5 ${sticky ? "lg:sticky lg:top-24" : ""}`.trim()}
    >
      <h2 className="font-display text-lg text-ink">Request a Quote</h2>
      {product && (
        <p className="mt-1 text-sm text-grey-600">
          For the <span className="font-semibold text-ink">{product.name}</span> — no
          prices are published online; request a quote for your requirement.
        </p>
      )}
      <div className="mt-4 grid gap-2">
        <a
          href={site.phoneHref}
          className="inline-flex h-11 items-center gap-2 rounded border border-grey-300 px-4 text-sm font-semibold text-ink hover:border-steel hover:text-steel"
        >
          <Phone width={16} height={16} /> {site.phoneDisplay}
        </a>
        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded border border-grey-300 px-4 text-sm font-semibold text-ink hover:border-steel hover:text-steel"
        >
          <WhatsApp width={16} height={16} /> WhatsApp us
        </a>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex h-11 items-center gap-2 rounded border border-grey-300 px-4 text-sm font-semibold text-ink hover:border-steel hover:text-steel"
        >
          <Mail width={16} height={16} /> {site.email}
        </a>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-steel">
          Fill form instead
        </summary>
        <div className="mt-4">
          <QuoteForm product={product?.name} country={country} />
        </div>
      </details>
    </div>
  );
}
