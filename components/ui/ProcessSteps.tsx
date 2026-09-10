/**
 * components/ui/ProcessSteps.tsx — ADR-0005 §5: ProcessSteps' numbered-box layout
 * is retired in favour of Steps' minimal numbered-dot line; this now renders Steps
 * so every existing call site (same props: `steps: {title, text, icon?}[]`) keeps
 * compiling and gets the new look. `icon` is accepted for backward compatibility
 * but Steps always shows the step number, per ADR-0005.
 */
import Steps from "./Steps";
import type { IconName } from "./Icons";

export default function ProcessSteps({
  steps,
}: {
  steps: { title: string; text: string; icon?: IconName }[];
}) {
  return <Steps steps={steps.map((s) => ({ title: s.title, text: s.text }))} />;
}
