"use client";

/**
 * app/export/HubForm.tsx — export enquiry form for the /export hub page only.
 * Unlike components/forms/ExportForm.tsx (used on /export/[country], which
 * pre-fills a hidden `country` field), this version asks the buyer to type
 * their own country since the hub page is not scoped to one destination.
 * Composed directly from the shared Web3Form engine rather than editing the
 * shared ExportForm component, which this worker does not own.
 */
import Web3Form, { type FieldDef } from "@/components/forms/Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "country", label: "Country", type: "text", required: true, placeholder: "e.g. Vietnam, Nigeria, Poland" },
  { name: "phone", label: "Phone (with country code)", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "product", label: "Machine of interest", type: "text", placeholder: "e.g. RA-F6020 HD, or not sure yet" },
  { name: "message", label: "Message", type: "textarea" },
];

export default function HubForm() {
  return (
    <Web3Form
      formName="export enquiry"
      fields={fields}
      submitLabel="Send Export Enquiry"
      successTitle="Thank you — your export enquiry has been sent."
      successText="Our export desk will get back to you, usually within one working day, with a quotation and shipping options for your country."
    />
  );
}
