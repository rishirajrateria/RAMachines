"use client";

/**
 * components/forms/FormGate.tsx — ADR-0009 §"The work" item 1: the thin,
 * always-shipped client shell around Web3Form's server-rendered native form.
 * Renders `children` (the plain, already-working `<form>`) untouched until
 * the form is at or near the viewport, using the same shared
 * `IntersectionObserver` every other scroll-triggered effect on the page uses
 * (`components/ui/observer` — ADR-0009 §3, one instance for the whole page,
 * not one per gate). Only then does it `next/dynamic`-import FormClient — the
 * fetch()-based enhancement — as its own chunk, so a home-page visitor who
 * never reaches the quote form never downloads it, and it never counts
 * against home's initial JS.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { observeOnce } from "@/components/ui/observer";
import type { FieldDef } from "./formFields";

const FormClient = dynamic(() => import("./FormClient"), { ssr: false });

export default function FormGate({
  children,
  formName,
  fields,
  hidden,
  submitLabel,
  successTitle,
  successText,
  redirectTo,
}: {
  children: ReactNode;
  formName: string;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  submitLabel: string;
  successTitle: string;
  successText: string;
  redirectTo: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setEnhanced(true));
  }, []);

  return (
    <div ref={ref}>
      {enhanced ? (
        <FormClient
          formName={formName}
          fields={fields}
          hidden={hidden}
          submitLabel={submitLabel}
          successTitle={successTitle}
          successText={successText}
          redirectTo={redirectTo}
        />
      ) : (
        children
      )}
    </div>
  );
}
