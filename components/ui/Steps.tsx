/**
 * components/ui/Steps.tsx — ADR-0005 §5: a single horizontal line with numbered
 * dots and short labels — replaces ProcessSteps' boxes. Accepts either plain
 * strings or `{title, text?}` objects so callers can pass a short label list or
 * a fuller step description. Vertical stack on mobile, horizontal row on desktop.
 *
 * ADR-0006 §Motion 1: each step reveals on scroll, staggered 60ms per step
 * (`data-stagger`, capped at the 6th) via Reveal — pages need no change.
 */
import Reveal from "./Reveal";

export type StepItem = string | { title: string; text?: string };

function normalise(step: StepItem): { title: string; text?: string } {
  return typeof step === "string" ? { title: step } : step;
}

export default function Steps({ steps }: { steps: StepItem[] }) {
  const items = steps.map(normalise);
  return (
    <ol className="grid gap-8 md:grid-flow-col md:auto-cols-fr md:gap-4">
      {items.map((step, i) => (
        <Reveal
          as="li"
          stagger
          key={step.title}
          className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center"
        >
          {i < items.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-[rgba(15,26,26,0.08)] md:left-[calc(50%+16px)] md:right-[calc(-50%+16px)] md:top-4 md:h-px md:w-auto"
            />
          )}
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
            {i + 1}
          </span>
          <div className="pb-1 md:pb-0">
            <h3 className="font-display text-base text-ink">{step.title}</h3>
            {step.text && <p className="mt-1 text-sm text-grey-600">{step.text}</p>}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
