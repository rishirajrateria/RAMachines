"use client";

/**
 * components/forms/FormClient.tsx — the JS enhancement over Web3Form's native
 * form: fetch()-based submit with inline submitting/success/error state and a
 * WhatsApp fallback on error. This is the same flow the old (always-shipped)
 * Web3Form component ran — only now it's lazy-loaded by FormGate as its own
 * chunk once the form is near the viewport, instead of shipping on every page
 * whether or not the visitor ever reaches the form. `noValidate` on the
 * `<form>` keeps the browser's native validation UI out of the way, exactly
 * as before, since this custom validation (and its error text) already
 * covers every field.
 */
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icons";
import { HiddenFields, FieldRows, SubmitButton, type FieldDef } from "./formFields";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9()+\-\s]{8,15}$/;

export default function FormClient({
  formName,
  fields,
  hidden,
  submitLabel,
  successTitle,
  successText,
  redirectTo,
}: {
  formName: string;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  submitLabel: string;
  successTitle: string;
  successText: string;
  redirectTo: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: FormData): Record<string, string> {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const value = String(data.get(field.name) ?? "").trim();
      if (field.required && !value) {
        next[field.name] = `${field.label} is required.`;
        continue;
      }
      if (!value) continue;
      if (field.type === "email" && !EMAIL_RE.test(value)) {
        next[field.name] = "Enter a valid email address.";
      }
      if (field.type === "tel" && !PHONE_RE.test(value)) {
        next[field.name] = "Enter a valid phone number (8–15 digits).";
      }
    }
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (String(data.get("botcheck") ?? "")) return; // honeypot tripped, silently ignore

    const fieldErrors = validate(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    try {
      const payload: Record<string, string> = {
        access_key: site.web3formsKey,
        subject: `New ${formName} enquiry — ${site.name}`,
        from_name: site.name,
        ...hidden,
      };
      for (const field of fields) {
        payload[field.name] = String(data.get(field.name) ?? "");
      }

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass flex gap-3 p-5">
        <Icon name="Check" size={20} className="mt-0.5 shrink-0 text-teal" />
        <div>
          <p className="font-semibold text-ink">{successTitle}</p>
          <p className="mt-1 text-sm text-grey-600">{successText}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      action="https://api.web3forms.com/submit"
      method="POST"
      className="space-y-4"
    >
      <HiddenFields formName={formName} hidden={hidden} redirectTo={redirectTo} />
      <FieldRows fields={fields} errors={errors} />
      <SubmitButton submitting={status === "submitting"} submitLabel={submitLabel} />

      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong sending the form. Please try again, or{" "}
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            WhatsApp us
          </a>
          .
        </p>
      )}
    </form>
  );
}
