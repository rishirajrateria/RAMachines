"use client";

/**
 * components/forms/TrainingForm.tsx — "Book Staff Training" form on
 * /services/operator-training.
 */
import Web3Form, { type FieldDef } from "./Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "trainees", label: "Number of trainees", type: "number" },
  { name: "location", label: "Training location", type: "text", placeholder: "Your site, or our Kolkata centre" },
  { name: "month", label: "Preferred month", type: "text", placeholder: "e.g. November 2026" },
];

export default function TrainingForm() {
  return (
    <Web3Form
      formName="training booking"
      fields={fields}
      submitLabel="Book Staff Training"
      successTitle="Thank you — your training request has been sent."
      successText="Our training coordinator will contact you to confirm a schedule, usually within one working day."
    />
  );
}
