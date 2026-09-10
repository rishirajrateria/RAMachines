"use client";

/**
 * components/forms/Web3Form.tsx — the single form engine every form on the site
 * wraps (QuoteForm, RepairForm, TrainingForm, JobWorkForm, ContactForm,
 * ExportForm). Posts JSON straight to Web3Forms (no backend). ADR-0005 §5: glass
 * inputs, rounded 14px, 48px tall. Renders visible labels, a honeypot field,
 * client-side validation, and submitting/success/error states.
 */
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icons";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "number";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  autoComplete?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9()+\-\s]{8,15}$/;

function fieldClasses() {
  return "glass h-12 w-full rounded-[14px] px-4 text-sm text-ink placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2";
}

function textareaClasses() {
  return "glass min-h-[7rem] w-full rounded-[14px] px-4 py-3 text-sm text-ink placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2";
}

export default function Web3Form({
  formName,
  fields,
  hidden,
  submitLabel,
  successTitle,
  successText,
}: {
  formName: string;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  submitLabel: string;
  successTitle: string;
  successText: string;
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {hidden &&
        Object.entries(hidden).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}

      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="mb-1.5 block text-sm font-semibold text-ink">
            {field.label}
            {field.required && <span aria-hidden="true"> *</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              rows={4}
              className={textareaClasses()}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue=""
              className={fieldClasses()}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            >
              <option value="" disabled>
                Select {field.label.toLowerCase()}
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              className={fieldClasses()}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
          )}
          {errors[field.name] && (
            <p id={`${field.name}-error`} className="mt-1 text-xs text-red-700">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
        {status !== "submitting" && <Icon name="ArrowRight" size={16} />}
      </button>

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
