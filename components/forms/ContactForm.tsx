"use client";

/**
 * components/forms/ContactForm.tsx — the general enquiry form on /contact, with a
 * subject dropdown routing the enquiry (buy / repair / training / export / job work /
 * other).
 */
import Web3Form, { type FieldDef } from "./Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name" },
  {
    name: "subject",
    label: "Subject",
    type: "select",
    required: true,
    options: ["Buy a machine", "Repair", "Training", "Export", "Job work", "Other"],
  },
  { name: "message", label: "Message", type: "textarea", required: true },
];

export default function ContactForm() {
  return (
    <Web3Form
      formName="contact"
      fields={fields}
      submitLabel="Send Message"
      successTitle="Thank you — your message has been sent."
      successText="We will get back to you shortly, usually within one working day."
    />
  );
}
