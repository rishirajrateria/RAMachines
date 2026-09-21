/**
 * components/forms/QuoteForm.tsx — "Request a Quote" form used on product pages, the
 * home page and inside CtaGroup/QuoteBlock. `product` pre-fills a hidden field so the
 * enquiry email states which machine the buyer is asking about.
 *
 * ADR-0009 §"The work" item 1: a Server Component again (Web3Form owns the one
 * client boundary the form actually needs). `redirectPath` lets a caller that
 * knows its own route (QuoteBlock, CtaGroup) send a no-JS submission back to
 * the right page; it defaults to the home page, the one call site (app/page.tsx)
 * that can't pass it explicitly.
 */
import Web3Form, { type FieldDef } from "./Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "location", label: "City / Country", type: "text", placeholder: "e.g. Ludhiana, India" },
  { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about your requirement" },
];

export default function QuoteForm({
  product,
  country,
  redirectPath,
}: {
  product?: string;
  country?: string;
  redirectPath?: string;
}) {
  return (
    <Web3Form
      formName="quote"
      fields={fields}
      hidden={{ product: product ?? "General enquiry", country: country ?? "" }}
      submitLabel="Request a Quote"
      successTitle="Thank you — your enquiry has been sent."
      successText="Our sales team will get back to you shortly, usually within one working day."
      redirectPath={redirectPath}
    />
  );
}
