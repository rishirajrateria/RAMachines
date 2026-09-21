/**
 * components/forms/Web3Form.tsx — the single form engine every form on the site
 * wraps (QuoteForm, RepairForm, TrainingForm, JobWorkForm, ContactForm,
 * ExportForm). ADR-0005 §5: glass inputs, rounded 14px, 48px tall.
 *
 * ADR-0009 §3: a Server Component rendering a real, plain
 * `<form method="POST" action="https://api.web3forms.com/submit">` —
 * Web3Forms' documented no-JS integration (hidden `access_key`, `subject`,
 * `from_name`, a `botcheck` honeypot and a `redirect` target) — with real
 * HTML5 validation attributes (see formFields.tsx). It works end to end with
 * zero JavaScript.
 *
 * ADR-0010: there is no JS layer over it any more. The previous `FormGate` /
 * `FormClient` pair re-implemented submission with `fetch()` purely to render
 * inline success/error state; that cost a client bundle on every page carrying
 * a form. Validation is now the browser's native HTML5 validation, which is
 * more accessible than the hand-rolled version it replaces.
 *
 * The success state survives that removal — it just doesn't need JavaScript.
 * Web3Forms redirects back to `?sent=1#sent`, and the confirmation panel is
 * pre-rendered with `id="sent"` and revealed by a `:target` rule (see
 * `.form-sent` in app/globals.css). So a visitor with JavaScript disabled still
 * gets a real, styled confirmation rather than being bounced silently back to
 * the page they started on. At most one form renders per route, so the single
 * `#sent` id is unambiguous.
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
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
  const redirectTo = `${site.url}${redirectPath}${redirectPath.includes("?") ? "&" : "?"}sent=1#sent`;

  return (
    <>
      <div id="sent" className="form-sent glass-strong rounded-[20px] p-6" role="status">
        <p className="font-display text-lg text-ink">{successTitle}</p>
        <p className="mt-2 text-sm text-grey-600">{successText}</p>
      </div>
      <form action="https://api.web3forms.com/submit" method="POST" className="form-on-sent space-y-4">
        <HiddenFields formName={formName} hidden={hidden} redirectTo={redirectTo} />
        <FieldRows fields={fields} />
        <SubmitButton submitLabel={submitLabel} />
      </form>
    </>
  );
}
