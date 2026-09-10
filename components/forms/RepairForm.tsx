"use client";

/**
 * components/forms/RepairForm.tsx — "Book a Repair" form on /services/machine-repair.
 */
import Web3Form, { type FieldDef } from "./Web3Form";

const fields: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "machine", label: "Machine brand & model", type: "text", placeholder: "e.g. RA-F3015 Pro, or another brand" },
  { name: "city", label: "City", type: "text", required: true },
  { name: "problem", label: "Problem description", type: "textarea", required: true },
];

export default function RepairForm() {
  return (
    <Web3Form
      formName="repair booking"
      fields={fields}
      submitLabel="Book a Repair"
      successTitle="Thank you — your repair request has been sent."
      successText="Our service desk will call to confirm a visit or remote diagnostic slot, usually within one working day."
    />
  );
}
