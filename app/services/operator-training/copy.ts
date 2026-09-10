/**
 * app/services/operator-training/copy.ts — long-form copy for /services/operator-training,
 * kept out of page.tsx so the route file stays under the 400-line limit. To edit: change
 * the paragraphs/arrays below directly; each export is plain data consumed by page.tsx.
 */
import type { IconName } from "@/components/ui/Icons";

export const introParagraphs: string[] = [
  "A laser cutting or robotic welding machine only performs as well as the person running it. RA Machine's operator training programme is designed to take a new operator from first power-on to confident, safe, productive daily operation, and to give experienced operators a structured refresher on safety procedure, maintenance tasks and nesting software they may have picked up informally on the job.",
  "Training is included with every new machine purchase and is also available as a standalone programme for teams that need to upskill new hires, recover from staff turnover, or move an operator onto a different machine model. Every session is led by the same engineers who install and service RA Machine equipment, so training reflects how the machine is actually used and maintained in production, not only how it is described in a manual.",
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
    body: "Machine start-up and shutdown, job set-up, material loading and safe day-to-day running of the specific model your team will use, including the settings that matter most for different materials and thicknesses.",
  },
  {
    title: "Safety",
    body: "Lockout and isolation procedure, laser and welding safety practice, personal protective equipment, and the housekeeping habits that keep a cutting or welding bay safe over years of daily use, not just on day one.",
  },
  {
    title: "Basic maintenance",
    body: "Daily and weekly checks an operator can safely perform — lens and nozzle inspection, filter checks, housekeeping around the bed and rails — so small issues are caught before they become a breakdown call.",
  },
  {
    title: "Nesting software",
    body: "Importing drawings, arranging parts for efficient material use, setting cutting sequence and basic parameter selection in the nesting and cutting-path software used to drive the machine.",
  },
];

export const locationParagraph: string =
  "Most customers choose on-site training, delivered alongside installation and commissioning so the team learns on the exact machine, material and shop-floor conditions they will use every day. If you prefer to keep staff away from the production floor, or want a smaller, more focused group, we run the same curriculum at our training centre in Kolkata. Either way, sessions run in batches of four to six trainees so each person gets meaningful hands-on machine time rather than only observing.";

export const whoForParagraph: string =
  "This programme suits new operators who have never run a laser cutting or robotic welding machine before, experienced operators moving onto a new machine model, and shop-floor supervisors who need to understand the equipment well enough to manage a team around it. It also works well as a structured refresher for existing staff after a software update or an extended gap since their original training.";

export const outcomesIntro: string = "By the end of the programme, trainees are able to:";

export const outcomes: string[] = [
  "Start up, set up and safely operate the machine for routine production jobs",
  "Follow lockout, isolation and personal safety procedure without supervision",
  "Carry out the daily and weekly maintenance checks that catch problems early",
  "Import a drawing, nest parts and run a cutting job through to completion",
];

export const outcomesClosing: string =
  "Each trainee who completes the programme receives a certificate of completion noting the machine type and modules covered, which many companies keep on file for internal skills records.";

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
