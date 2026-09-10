"use client";

/**
 * components/forms/QuoteForm.tsx — "Request a Quote" form used on product pages, the
 * home page and inside CtaGroup/QuoteBlock. `product` pre-fills a hidden field so the
 * enquiry email states which machine the buyer is asking about.
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

export default function QuoteForm({ product, country }: { product?: string; country?: string }) {
  return (
    <Web3Form
      formName="quote"
      fields={fields}
      hidden={{ product: product ?? "General enquiry", country: country ?? "" }}
      submitLabel="Request a Quote"
      successTitle="Thank you — your enquiry has been sent."
      successText="Our sales team will get back to you shortly, usually within one working day."
    />
  );
}
