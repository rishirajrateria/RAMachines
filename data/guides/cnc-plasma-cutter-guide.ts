import type { Guide } from "../types";

export const guide: Guide = {
  slug: "cnc-plasma-cutter-guide",
  title: "CNC Plasma Cutter Guide: 100 A vs 200 A Explained",
  description:
    "How to choose a CNC plasma cutting machine: 100 A vs 200 A, torch height control, air supply, cutting tables and consumables, explained in plain terms.",
  h1: "Choosing a CNC Plasma Cutting Machine: 100 A vs 200 A",
  summary:
    "Choose a source towards 100 A if most of your work is thin and medium mild steel, where a finer arc gives cleaner small features and lower running cost. Choose a source towards 200 A if you cut heavier plate every day or need more speed on mid-range thicknesses. Then specify torch height control, a clean air supply and fume handling to match.",
  sections: [
    {
      h2: "What does plasma current decide?",
      paragraphs: [
        "The current of the plasma power source, measured in amperes, sets how much energy the arc carries into the cut. More current means a hotter, more forceful arc that melts through thicker plate and cuts mid-range thicknesses faster. Less current means a narrower, more concentrated arc that gives a finer kerf and cleaner detail on thinner material.",
        "Each current level has a matching set of consumables. A torch running at lower current uses a nozzle with a smaller orifice, which is why low-current cutting gives sharper corners and smaller holes. Running a high-current source turned down to cut thin sheet works, but it rarely matches the edge quality of a source and consumables designed for that thickness.",
        "Thickness ratings also deserve a careful reading. As a general rule across the industry, the thickness a plasma system can pierce and cut at production quality is lower than the maximum it can sever starting from the plate edge. Size the source to the plate you cut routinely at good quality, not to the severance limit.",
      ],
    },
    {
      h2: "When is a source towards 100 A the right choice?",
      paragraphs: [
        "A source at the lower end of the range suits workshops whose cutting is mostly thin and medium sheet and light plate: enclosures, brackets, ducting, furniture, gates and general job work. It gives a narrower kerf and better detail on those thicknesses, uses smaller consumables that cost less, and draws less power.",
        "It is also the sensible first machine for a fabricator bringing cutting in-house for the first time. The purchase price is lower, the electrical and air demands are lighter, and it still handles occasional heavier plate, though more slowly.",
        "The smaller arc has a less obvious benefit too: it puts less heat into thin material. Long, narrow parts cut from thin sheet distort less, and parts that will be bent afterwards keep their flatness better, which saves straightening time downstream.",
      ],
    },
    {
      h2: "When do you need a source towards 200 A?",
      paragraphs: [
        "A higher-current source earns its place when heavier plate is routine rather than occasional: structural steel, base plates, earthmoving and agricultural equipment, tanks and heavy engineering. It cuts those thicknesses faster, pierces them more reliably and leaves a cleaner edge than a smaller source working at its limit.",
        "It also helps when output is the constraint. Even on medium plate that a lower-current source can cut, more current allows higher cutting speed, so a busy shop finishes more parts per shift. The trade-off is a higher purchase price, more expensive consumables, a larger power connection and greater air demand.",
        "One caution: even a heavy fabricator cuts plenty of thinner parts. Before paying for the extra capacity, check that the larger source can run lower-current consumables for those jobs and that the edge quality on your thinner parts will still be acceptable. Going through your own drawings with the supplier, part by part, is the most reliable way to check.",
      ],
    },
    {
      h2: "100 A vs 200 A at a glance",
      paragraphs: [
        "RA Machine's CNC plasma machines cover 100 A to 200 A, with a cutting range of 2 mm to 25 mm across the family. Within that range, the choice usually comes down to these points:",
      ],
      bullets: [
        "Mostly thin and medium sheet: a source towards 100 A gives finer detail and lower running cost.",
        "Regular work at the heavier end of the cutting range: a source towards 200 A cuts it faster and more cleanly.",
        "Many small holes and intricate profiles: lower current with fine consumables generally performs better.",
        "Output-limited shop cutting medium plate all day: higher current raises cutting speed.",
        "Limited electrical supply or a small compressor: lower current is easier to install and run.",
        "A wide mix of thicknesses: size to the plate that takes most of your machine time, not the extremes.",
      ],
    },
    {
      h2: "What else should you specify besides current?",
      paragraphs: [
        "Current gets the attention, but several other choices decide how good the parts are and how smoothly the machine runs.",
        "Torch height control keeps the torch at the correct distance from the plate as it warps from heat, using the arc voltage to sense height. Without it, cut quality and consumable life suffer badly. The cutting area should match the sheet and plate sizes you buy, so full sheets load without trimming. Nesting software lays parts out to reduce scrap and should be easy for your team to learn.",
        "The air supply matters more than most buyers expect. Plasma needs clean, dry air at steady pressure; oil or moisture in the line shortens consumable life and spoils the edge. Budget for a suitable compressor, a refrigerated dryer and filtration. Finally, decide how fume will be handled: a water table traps fume and dust and cools parts, while a downdraught table with extraction keeps parts dry.",
      ],
    },
    {
      h2: "What does it cost to run a CNC plasma cutter?",
      paragraphs: [
        "Day-to-day costs are electricity, compressed air and consumables. The electrode and nozzle wear with every pierce, so a nest of many small parts uses them faster than long cuts on large parts. Replacing consumables before they are fully worn usually costs less than the scrap and grinding a worn set causes.",
        "Signs that consumables need changing include a wider kerf, more bevel on one side, extra dross and difficulty starting the arc. Operators should also keep the torch clean, check air filters and drains daily, and keep the water table or extraction system in good order. These routines are simple, and they keep cut quality consistent from the first part of the shift to the last.",
      ],
    },
    {
      h2: "How RA Machine configures a plasma machine",
      paragraphs: [
        "Every RA Machine CNC plasma cutter is configured to the buyer's job: the current, cutting area, torch height control, table type and software are chosen from your drawings, plate sizes and volumes. Lead time is typically 8 to 10 weeks.",
        "Installation, commissioning and operator training are included, along with a check of your air supply and cutting parameters for your materials. After handover, we provide remote diagnostics within 4 working hours, stocked spares and on-site service, backed by a 12-month warranty.",
      ],
    },
  ],
  faqs: [
    {
      q: "Can a CNC plasma machine cut stainless steel and aluminium?",
      a: "Yes. Plasma cuts any electrically conductive metal, including stainless steel and aluminium. Air plasma cuts both, but the edge on stainless steel can discolour and aluminium edges can be rougher than on mild steel. Different plasma gases improve edge quality on these metals. If stainless steel or aluminium is a large part of your work, mention it early, because it affects the gas setup and may favour a fiber laser.",
    },
    {
      q: "Do I need a water table or a downdraught table?",
      a: "Both control fume and dust, which plasma produces in quantity. A water table holds water under the plate to trap fume and sparks, cool the parts and reduce noise; it suits most mild steel cutting. A downdraught table draws fume down through the bed into a filter unit and keeps parts dry, which some buyers prefer for parts that must not rust. The choice depends on your materials and workshop.",
    },
    {
      q: "Do plasma-cut edges cause problems when welding?",
      a: "Usually not, but it is worth knowing why it sometimes happens. When carbon steel is cut with air plasma, the edge can pick up nitrogen and a thin hardened layer. On critical welds this can contribute to porosity, and the hard edge can be harder to machine or bend. Light grinding of the edge, correct parameters and fresh consumables keep the risk low for most fabrication work.",
    },
    {
      q: "Is a handheld plasma cutter enough instead of a CNC machine?",
      a: "For occasional cutting, repairs and site work, a handheld plasma cutter is useful and inexpensive. For production, a CNC machine is in a different class: it cuts the same part accurately every time, nests parts to save plate, keeps torch height constant for consistent edges and frees the operator from marking out. Once you cut repeat parts regularly, the time and material saved usually justify CNC.",
    },
  ],
  families: ["cnc-plasma-cutting-machines"],
  related: ["laser-vs-plasma-cutting", "preparing-factory-for-cnc-machine", "cnc-machine-buying-checklist"],
  published: "2026-10-07",
  updated: "2026-10-07",
};
