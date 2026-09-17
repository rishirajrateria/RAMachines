/**
 * components/forms/Web3Form.tsx — the single form engine every form on the site
 * wraps (QuoteForm, RepairForm, TrainingForm, JobWorkForm, ContactForm,
 * ExportForm). ADR-0005 §5: glass inputs, rounded 14px, 48px tall.
 *
 * ADR-0009 §3/§"The work" item 1: this is now a Server Component rendering a
 * real, plain `<form method="POST" action="https://api.web3forms.com/submit">`
 * — Web3Forms' documented no-JS integration (hidden `access_key`, `subject`,
 * `from_name`, a `botcheck` honeypot and a `redirect` target) — with real
 * HTML5 validation attributes (see formFields.tsx). It works end to end with
 * zero JavaScript.
 *
 * `FormGate` (a small, always-shipped Client Component) then progressively
 * enhances it: once the form scrolls near the viewport, it `next/dynamic`-
 * imports FormClient — the exact previous fetch()-based flow (inline
 * submitting/success/error state, WhatsApp fallback on error) — as a
 * separate chunk that a JS visitor who never scrolls to the form never pays
 * for, and that home's initial JS payload never has to include. FormClient's
 * own `<form>` keeps `noValidate`, so a JS visitor's experience — the custom
 * validation and error text — is byte-for-byte what it was before this split.
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import FormGate from "./FormGate";
import { HiddenFields, FieldRows, SubmitButton, type FieldDef } from "./formFields";

export type { FieldDef };

export default function Web3Form({
  formName,
  fields,
  hidden,
  submitLabel,
  successTitle,
  successText,
  redirectPath = paths.home,
}: {
  formName: string;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  submitLabel: string;
  successTitle: string;
  successText: string;
  /** Where a no-JS submission bounces back to (Web3Forms' `redirect` field
   * needs an absolute URL). Defaults to the home page — the only page every
   * caller of this shared component can name without knowing where it was
   * mounted; callers that do know their own route (see QuoteBlock/CtaGroup)
   * pass their real path instead. */
  redirectPath?: string;
}) {
  const redirectTo = `${site.url}${redirectPath}${redirectPath.includes("?") ? "&" : "?"}sent=1`;

  return (
    <FormGate formName={formName} fields={fields} hidden={hidden} submitLabel={submitLabel} successTitle={successTitle} successText={successText} redirectTo={redirectTo}>
      <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
        <HiddenFields formName={formName} hidden={hidden} redirectTo={redirectTo} />
        <FieldRows fields={fields} />
        <SubmitButton submitLabel={submitLabel} />
      </form>
    </FormGate>
  );
}
