/**
 * components/forms/formFields.tsx — the field markup shared by the native,
 * zero-JS form (Web3Form.tsx) and its JS enhancement (FormClient.tsx), so the
 * two can never drift apart visually. Pure presentational pieces only — no
 * hooks, no "use client" — safe to import from a Server Component or a Client
 * Component alike.
 *
 * `FieldRows` renders real HTML5 validation attributes (`required`,
 * `type="email"`, `pattern`/`title` for phone numbers, `minLength` on
 * required free-text fields) so the plain HTML form catches obviously-bad
 * input before it ever leaves the browser, with no JavaScript at all.
 * `errors` (client-only; always empty on the server-rendered pass) layers the
 * existing inline error message + `aria-invalid` on top once FormClient takes
 * over — it never changes what the browser-native validation already does.
 */
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

// ADR-0005 §5: glass inputs, rounded 14px, 48px tall.
function fieldClasses() {
  return "glass h-12 w-full rounded-[14px] px-4 text-sm text-ink placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2";
}

function textareaClasses() {
  return "glass min-h-[7rem] w-full rounded-[14px] px-4 py-3 text-sm text-ink placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2";
}

const PHONE_PATTERN = "[0-9()+\\-\\s]{8,15}";
const PHONE_TITLE = "Enter a valid phone number (8–15 digits).";

/** Real, browser-native validation attributes for a field — the no-JS form's
 * only line of defence, and a harmless no-op on the JS form (which keeps
 * `noValidate` so its existing custom validation/error text is unchanged). */
function validationAttrs(field: FieldDef) {
  if (field.type === "tel") return { pattern: PHONE_PATTERN, title: PHONE_TITLE };
  if (field.type === "text" && field.required) return { minLength: 2 };
  if (field.type === "textarea" && field.required) return { minLength: 10 };
  return {};
}

export function HiddenFields({
  formName,
  hidden,
  redirectTo,
}: {
  formName: string;
  hidden?: Record<string, string>;
  redirectTo: string;
}) {
  return (
    <>
      {/* Web3Forms' documented honeypot convention: a hidden checkbox named
          "botcheck" — submissions where it comes back checked are dropped
          server-side, no application code involved. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="access_key" value={site.web3formsKey} />
      <input type="hidden" name="subject" value={`New ${formName} enquiry — ${site.name}`} />
      <input type="hidden" name="from_name" value={site.name} />
      {/* Only meaningful for the plain-POST (no-JS) path: FormClient always
          intercepts submit and never lets the browser navigate. */}
      <input type="hidden" name="redirect" value={redirectTo} />
      {hidden && Object.entries(hidden).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
    </>
  );
}

export function FieldRows({ fields, errors = {} }: { fields: FieldDef[]; errors?: Record<string, string> }) {
  return (
    <>
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
              {...validationAttrs(field)}
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
              {...validationAttrs(field)}
            />
          )}
          {errors[field.name] && (
            <p id={`${field.name}-error`} className="mt-1 text-xs text-red-700">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}
    </>
  );
}

export function SubmitButton({ submitting, submitLabel }: { submitting?: boolean; submitLabel: string }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-hover disabled:opacity-60"
    >
      {submitting ? "Sending…" : submitLabel}
      {!submitting && <Icon name="ArrowRight" size={16} />}
    </button>
  );
}
