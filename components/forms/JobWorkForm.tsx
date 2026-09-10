"use client";

/**
 * components/forms/JobWorkForm.tsx — quote form for /services/laser-cutting-job-work
 * (cutting done on our own machines for customers who do not want to buy one).
 */
import Web3Form, { type FieldDef } from "./Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  {
    name: "requirement",
    label: "Material, thickness & drawing format",
    type: "textarea",
    required: true,
    placeholder: "e.g. 6 mm mild steel, DXF drawings, 50 pieces",
  },
];

export default function JobWorkForm() {
  return (
    <Web3Form
      formName="job work quote"
      fields={fields}
      submitLabel="Request a Quote"
      successTitle="Thank you — your enquiry has been sent."
      successText="We will review your drawings and requirement and revert with a quote, usually within one working day."
    />
  );
}
