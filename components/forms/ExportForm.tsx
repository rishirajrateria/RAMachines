"use client";

/**
 * components/forms/ExportForm.tsx — export enquiry form on /export/[country] pages.
 * `country` is pre-filled as a hidden field so the enquiry email states the buyer's
 * country without asking them to retype it.
 */
import Web3Form, { type FieldDef } from "./Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "phone", label: "Phone (with country code)", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "product", label: "Machine of interest", type: "text", placeholder: "e.g. RA-F6020 HD, or not sure yet" },
  { name: "message", label: "Message", type: "textarea" },
];

export default function ExportForm({ country }: { country: string }) {
  return (
    <Web3Form
      formName="export enquiry"
      fields={fields}
      hidden={{ country }}
      submitLabel="Send Export Enquiry"
      successTitle="Thank you — your export enquiry has been sent."
      successText={`Our export desk will get back to you about shipping to ${country}, usually within one working day.`}
    />
  );
}
