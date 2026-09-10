/**
 * app/services/operator-training/copy.ts — long-form copy for /services/operator-training,
 * kept out of page.tsx so the route file stays under the 400-line limit. To edit: change
 * the paragraphs/arrays below directly; each export is plain data consumed by page.tsx.
 */
import type { IconName } from "@/components/ui/Icons";

export const introParagraphs: string[] = [
  "Training is included with every new machine purchase and is also available as a standalone programme to upskill new hires or move an operator onto a different model. Sessions are led by the same engineers who install and service RA Machine equipment.",
];

export interface CurriculumModule {
  title: string;
  body: string;
}

export const curriculumIntro: string =
  "The curriculum covers four areas that matter most for safe, productive day-to-day operation.";

export const curriculumModules: CurriculumModule[] = [
  {
    title: "Operation",
    body: "Start-up, shutdown, job set-up and material loading, including the settings that matter most for different materials and thicknesses.",
  },
  {
    title: "Safety",
    body: "Lockout and isolation procedure, laser and welding safety practice, PPE, and housekeeping habits for a safe bay over years of use.",
  },
  {
    title: "Basic maintenance",
    body: "Daily and weekly checks an operator can safely perform — lens and nozzle inspection, filter checks, bed and rail housekeeping.",
  },
  {
    title: "Nesting software",
    body: "Importing drawings, arranging parts for efficient material use, and setting cutting sequence in the nesting software.",
  },
];

export const locationParagraph: string =
  "Most customers choose on-site training, delivered alongside installation so the team learns on the exact machine and conditions they will use daily; a smaller group can instead train at our Kolkata centre.";

export const whoForParagraph: string =
  "This programme suits new operators, experienced operators moving onto a new model, and supervisors who need to understand the equipment well enough to manage a team around it.";

export const outcomesIntro: string = "By the end of the programme, trainees are able to:";

export const outcomes: string[] = [
  "Start up, set up and safely operate the machine for routine production jobs",
  "Follow lockout, isolation and personal safety procedure without supervision",
  "Carry out the daily and weekly maintenance checks that catch problems early",
  "Import a drawing, nest parts and run a cutting job through to completion",
];

export const bookIntro: string =
  "Tell us your company details, number of trainees, preferred location and a target month, and our training coordinator will confirm available dates.";

/* --------------------------- ADR-0002 visual additions --------------------------- */
// Purely presentational metadata — icons, short chip/step labels — layered on top of
// the copy above (page.tsx). No paragraph text is added, removed or reworded here.

export const heroLead: string =
  "Hands-on training on the exact machine your team will run, led by the same engineers who install and service it, on-site or at our Kolkata training centre.";

export const heroChips: { label: string; icon: IconName }[] = [
  { label: "On-site or Kolkata centre", icon: "MapPin" },
  { label: "4–6 trainees per batch", icon: "Users" },
  { label: "Hands-on machine time", icon: "Gauge" },
  { label: "Certificate included", icon: "Certificate" },
];

export const moduleIcons: Record<string, IconName> = {
  Operation: "Gear",
  Safety: "Shield",
  "Basic maintenance": "Wrench",
  "Nesting software": "Layers",
};

export interface TrainingProcessStep {
  title: string;
  text: string;
  icon: IconName;
}

export const trainingProcessSteps: TrainingProcessStep[] = [
  { title: "Enquiry", text: "Tell us trainee count, machine model and preferred timing.", icon: "Phone" },
  { title: "Plan", text: "We confirm a schedule, location and curriculum for your team.", icon: "Calendar" },
  { title: "Training", text: "Hands-on sessions in batches of four to six trainees.", icon: "GraduationCap" },
  { title: "Assessment", text: "Trainees demonstrate safe, independent operation on the machine.", icon: "Gauge" },
  { title: "Certificate", text: "Each trainee receives a certificate noting modules covered.", icon: "Certificate" },
];
