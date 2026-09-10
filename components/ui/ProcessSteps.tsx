/**
 * components/ui/ProcessSteps.tsx — numbered circles joined by a connecting line:
 * vertical stack on mobile, a horizontal row on desktop (export process, install
 * process, quote-to-delivery flow…). Pass `icon` per step to show an icon instead of
 * the step number inside the circle.
 */
import { Icon, type IconName } from "./Icons";

export default function ProcessSteps({
  steps,
}: {
  steps: { title: string; text: string; icon?: IconName }[];
}) {
  return (
    <ol className="grid gap-8 md:grid-flow-col md:auto-cols-fr md:gap-6">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center"
        >
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-px bg-grey-200 md:left-[calc(50%+22px)] md:right-[calc(-50%+22px)] md:top-[22px] md:h-px md:w-auto"
            />
          )}
          <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-spark text-sm font-bold text-white">
            {step.icon ? <Icon name={step.icon} size={20} /> : i + 1}
          </span>
          <div className="pb-1 md:pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-spark">
              Step {i + 1}
            </p>
            <h3 className="mt-1 font-display text-lg text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm text-grey-600">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
