/**
 * data/categories.ts — the 4 product categories, each with the buyer-education
 * copy shown on its /products/[category] landing page.
 *
 * To edit: change the fields below. `longCopy` is an array of paragraphs (join
 * with blank lines when rendering); keep it 350–500 words total per category
 * (ADR-0003) — unique buyer-education facts only, not restated GlancePanel/
 * chip-row content.
 * `comparisonSpecs` must list spec `label`s that actually appear in the
 * `specs` array of the products in that category (see data/products.ts), in
 * the order they should appear as comparison table rows.
 * To add a category: add a new CategorySlug in data/types.ts first (owned by
 * the integration owner), then add its entry here and assign products to it.
 */
import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "fiber-laser-cutting-machines",
    name: "Fiber Laser Cutting Machines",
    shortName: "Fiber Laser",
    description:
      "Fiber laser cutting machines from 1.5 kW to 12 kW for sheet metal fabrication, engineered and built in Kolkata for India and export.",
    intro:
      "Fiber laser cutting machines are the workhorse of modern sheet metal fabrication, using a high-power fiber-optic laser beam to cut carbon steel, stainless steel, aluminium and other metals with narrow kerf, minimal heat distortion and very little manual finishing. Our fiber laser range spans four power classes, from the entry-level RA-F1530 to the heavy-duty RA-F12K, so job shops, OEM fabricators and large-scale manufacturers can each choose a machine matched to their material thickness, sheet size and daily output.",
    longCopy: [
      "A fiber laser cutting machine pumps energy into a solid-state fiber laser source, which delivers a tightly focused beam through a fiber-optic cable to a cutting head positioned over the sheet by a CNC-controlled gantry. Unlike CO2 lasers, which generate the beam in a gas-filled tube, fiber lasers convert electrical energy to light with much higher efficiency, giving lower running cost per hour and consistent beam quality for years with comparatively little maintenance.",
      "Power output is the first buyer decision. Machines from 1–2 kW, such as our RA-F1530, suit thin-to-medium gauge sheet up to around 16 mm carbon steel and are the most economical entry point. The 3 kW RA-F3015 Pro extends to about 25 mm and cuts thinner material noticeably faster, which matters when throughput drives your schedule. From 6 kW upward, the RA-F6020 HD and RA-F12K are built for structural steel and pressure vessel shops cutting 25–50 mm plate without losing tolerance.",
      "Bed size is the second major decision. A 1500 × 3000 mm area suits most general fabrication, while the RA-F6020 HD's 2000 × 6000 mm bed is sized for long structural sections and fewer sheet repositions — though a larger bed also means a larger footprint and heavier frame to keep the gantry rigid at speed.",
      "Carbon steel is typically cut with oxygen assist gas for efficient thicker cutting; stainless steel and aluminium usually take nitrogen for a clean, oxide-free edge ready for welding without extra grinding. Reflective materials like copper and brass need adequate back-reflection protection, which our cutting heads and sources are specified to handle.",
      "Running costs are dominated by electricity, assist gas and consumables such as nozzles and lenses — modest against the labour and finishing time saved over plasma or manual cutting. Our AMC plans (see our repair and maintenance service) are built around the same preventive schedule that keeps cutting quality consistent for years.",
      "As volume grows, an automatic sheet exchange table lets an operator load the next sheet while the machine finishes the current one; every RA Machine fiber laser ships with nesting-capable CNC software as standard, and exchange tables can be specified on the 6 kW and 12 kW models.",
      "Fiber lasers are increasingly the default for Indian automotive component makers, elevator and switchgear fabricators, HVAC ducting manufacturers and structural steel contractors moving on from plasma or oxy-fuel cutting. Export units run on standard 415 V three-phase supply with straightforward voltage adaptation and meet CE safety requirements.",
    ],
    applications: [
      "Sheet metal fabrication and job work",
      "Automobile and auto component manufacturing",
      "Elevator and escalator panel fabrication",
      "Kitchen equipment and commercial appliance manufacturing",
      "HVAC ducting and sheet metal ventilation systems",
      "Electrical enclosures, panels and switchgear fabrication",
      "Structural steel and heavy engineering fabrication",
      "Signage, sign-making and architectural metalwork",
      "Agricultural equipment and implement manufacturing",
      "Railway coach and rolling stock component fabrication",
    ],
    comparisonSpecs: [
      "Laser power",
      "Working area",
      "Max sheet thickness",
      "Positioning accuracy",
      "Max travel speed",
      "Assist gases",
      "Power supply",
      "Machine weight",
    ],
    faqs: [
      {
        q: "What is the difference between a 1.5 kW and a 3 kW fiber laser cutting machine?",
        a: "Power determines both maximum cuttable thickness and cutting speed on thinner material. A 1.5 kW machine comfortably cuts up to around 16 mm carbon steel and suits general fabrication, while a 3 kW machine extends to about 25 mm and cuts thinner gauge sheet noticeably faster, which matters for high-volume production where cycle time drives overall output.",
      },
      {
        q: "Which assist gas should I use for fiber laser cutting?",
        a: "Oxygen is generally used for carbon steel because it adds an exothermic reaction that speeds cutting of thicker plate, while nitrogen produces a clean, oxide-free edge on stainless steel and aluminium suited to welding or visible finishes without further grinding. Compressed air is a lower-cost option for thinner, less critical parts.",
      },
      {
        q: "Do fiber laser machines need a chiller?",
        a: "Yes. The laser source and cutting head generate heat that must be removed to keep beam quality stable and protect the optics, so every fiber laser cutting machine ships with a dedicated industrial water chiller sized to the laser power, running as a closed loop that needs periodic coolant and filter checks.",
      },
      {
        q: "Can one machine cut both thin sheet and thick plate well?",
        a: "Yes, within its rated range. A correctly specified fiber laser adjusts power, speed and gas pressure automatically by material and thickness through its CNC control software, so the same machine handles thin gauge sheet and its rated maximum plate thickness without needing separate equipment, provided the thickness stays within the machine's specification.",
      },
      {
        q: "How much floor space does a fiber laser cutting machine need?",
        a: "Beyond the machine's own footprint, allow clearance on all sides for sheet loading, cable and hose runs, the chiller unit, and safe operator access, plus space for a forklift or crane to load raw sheet and remove cut parts. Exact footprint is listed in each product's specification table; we can also advise on layout during quotation.",
      },
      {
        q: "What after-sales support is included with a fiber laser cutting machine?",
        a: "Every machine includes installation, commissioning, operator training and a standard warranty on major components, with remote diagnostic support and spares available afterward. Optional Annual Maintenance Contracts extend this with scheduled preventive visits; see our machine repair and maintenance service for details on ongoing support once your machine is in production.",
      },
    ],
    image: { src: "/categories/fiber-laser-cutting-machines.webp", alt: "Fiber laser cutting machine cutting a steel sheet", width: 1200, height: 800 },
  },
  {
    slug: "tube-laser-cutting-machines",
    name: "Tube Laser Cutting Machines",
    shortName: "Tube Laser",
    description:
      "Fiber laser tube cutting machine for round, square and rectangular profiles, handling handrail, furniture and structural tube fabrication.",
    intro:
      "A tube laser cutting machine automates what was previously slow, error-prone manual work: cutting, notching and profiling round, square and rectangular tube for welded assemblies. Our RA-T6000 loads, chucks, rotates and cuts tube automatically to a CNC-programmed profile, producing clean mitred joints and complex end-cuts that would take a skilled fabricator far longer to mark out and cut by hand.",
    longCopy: [
      "Tube laser cutting clamps a length of tube in a servo-driven chuck, which rotates and feeds it past a cutting head while the beam profiles straight cuts, angled mitres, slots, holes and complex intersecting joints for tube-to-tube welding. A follow-rest supports the free end of longer tube to prevent whip during rotation, essential for holding accuracy over several metres.",
      "The RA-T6000 runs a 2 kW fiber laser source as standard, configurable to 3 kW for thicker wall tube or faster cycles, and handles round tube from 20 mm to 219 mm diameter plus square and rectangular profiles up to 6.5 metres. Auto-loading and auto-unloading cut operator handling time significantly versus manual saw-and-notch workflows.",
      "Furniture and handrail fabricators typically work smaller-diameter, thinner-wall tube where cut speed and edge finish matter most; structural and automotive chassis fabricators cut heavier wall tube where rigidity and laser power need headroom to cut cleanly without excessive dwell time at each joint.",
      "Carbon steel, stainless steel, aluminium and brass tube all cut cleanly, following the same oxygen-for-steel, nitrogen-for-stainless/aluminium assist-gas principle as flat sheet. Because tube joints are compound-angle cuts, edge quality has a bigger impact on weld fit-up than flat sheet work, so a laser's precision earns back its cost quickly in reduced fitting time.",
      "A basic single-chuck setup suits lower volumes or varied runs, while the RA-T6000's standard auto-loading rack pays for itself on repeat batches, shifting operator time from handling to programming and quality checks.",
      "Tube laser cutting has become the standard upgrade path for furniture manufacturers, staircase and railing fabricators, solar mounting structure producers and automotive roll cage builders who have outgrown manual notching and want repeatable joint geometry across every batch.",
    ],
    applications: [
      "Tubular steel furniture manufacturing",
      "Handrail and staircase fabrication",
      "Automotive chassis and roll cage fabrication",
      "Agricultural equipment frame manufacturing",
      "Fitness and gym equipment fabrication",
      "Solar mounting structure manufacturing",
      "Scaffolding and access equipment fabrication",
      "Exhaust and pipe fabrication",
    ],
    comparisonSpecs: [
      "Laser power",
      "Max tube length",
      "Round tube diameter range",
      "Positioning accuracy",
      "Max travel speed",
      "Power supply",
    ],
    faqs: [
      {
        q: "What tube sizes can a tube laser cutting machine handle?",
        a: "The RA-T6000 cuts round tube from 20 mm to 219 mm diameter, square tube from 20×20 mm to 160×160 mm, and rectangular tube across a comparable range, in standard lengths up to 6.5 metres. Exact limits depend on wall thickness and material, so we confirm feasibility for your specific tube stock at the quotation stage.",
      },
      {
        q: "Can a tube laser machine also cut flat sheet?",
        a: "No, tube laser machines are purpose-built around a rotating chuck and follow-rest for tubular and profile stock, and are not designed to cut flat sheet. Fabricators who need both typically run a dedicated flat-sheet fiber laser like the RA-F1530 or RA-F3015 Pro alongside a tube laser such as the RA-T6000.",
      },
      {
        q: "How does auto-loading work on the RA-T6000?",
        a: "Raw tube is stacked on a loading rack; the machine automatically feeds the next length into the chuck once the current tube is finished cutting, and separates finished parts onto an unloading rack or conveyor. This reduces operator handling time and keeps the laser cutting continuously across a batch instead of waiting for manual reloads.",
      },
      {
        q: "What joint types can be cut for welded tube assemblies?",
        a: "The machine profiles straight cuts, angled mitres, saddle and fish-mouth joints for tube-to-tube intersections, slots and holes, all directly from your CAD or CAM-generated CNC program. This produces a precise fit-up for welding, reducing the manual grinding and fitting time that hand-cut or bandsaw-cut tube typically requires before welding.",
      },
      {
        q: "What assist gas is used for tube laser cutting?",
        a: "The same principle as flat sheet applies: oxygen assist gas is generally used for carbon steel tube to cut thicker wall sections efficiently, while nitrogen produces a clean, oxide-free edge on stainless steel and aluminium tube that is ready for welding without further edge preparation or grinding.",
      },
      {
        q: "Is training included for switching from manual tube cutting to a laser machine?",
        a: "Yes, operator training is included with every RA-T6000 purchase, covering safe loading and unloading, tube-nesting software, common profile programming and day-to-day maintenance. Most fabrication teams with prior sheet metal or workshop experience become confident running routine jobs within a few days of hands-on training.",
      },
    ],
    image: { src: "/categories/tube-laser-cutting-machines.webp", alt: "Fiber laser tube cutting machine profiling round steel tube", width: 1200, height: 800 },
  },
  {
    slug: "co2-laser-machines",
    name: "CO2 Laser Machines",
    shortName: "CO2 Laser",
    description:
      "CO2 laser cutting and engraving machine for acrylic, wood, MDF, leather and fabric, built for signage, packaging and display fabrication.",
    intro:
      "CO2 laser machines use a sealed, water-cooled glass laser tube to cut and engrave non-metallic materials with fine detail and a clean edge, making them the standard tool for signage, acrylic display fabrication, woodworking, leather goods and packaging sampling. Our RA-C1390 combines a 1300 × 900 mm working bed with a 130 W CO2 source, sized for both production cutting and detailed engraving work on the same machine.",
    longCopy: [
      "A CO2 laser generates its beam inside a sealed glass tube filled with a carbon dioxide gas mixture, excited by a high-voltage discharge and cooled by a recirculating water chiller. Mirrors direct the beam to a moving head, where a lens focuses it to a fine point capable of vaporising material along a cut line or, at lower power, marking a surface without cutting through it.",
      "The RA-C1390's 1300 × 900 mm bed accommodates full sheets of standard acrylic, plywood and MDF stock, reducing offcut waste versus smaller-format machines. Its 130 W tube, configurable from 100–150 W, balances cutting speed on thicker board against the detail achievable when engraving fine text or artwork.",
      "Acrylic, plywood, MDF, leather, fabric, rubber and foam all cut cleanly with a sealed edge needing no secondary finishing, since the laser vaporises material along a narrow kerf rather than tearing it. Acrylic in particular takes on a flame-polished, glass-smooth edge straight off the machine — why CO2 lasers are the default for acrylic signage and display fabrication.",
      "A 130 W class machine does not have the power density fiber lasers apply to metal cutting, but the RA-C1390 can perform surface marking and engraving on suitably prepared or coated metal, such as nameplates — a distinct process from through-cutting, often used alongside acrylic and board work on the same line.",
      "Running costs are modest: electricity, the chiller, and periodic replacement of the laser tube once output power degrades past its rated service life. Focus lenses and mirrors need occasional cleaning, and the bed should be kept clear of char buildup when cutting wood or MDF.",
      "The controller accepts standard vector and raster files from common design software, with layer-based settings controlling which lines are cut, scored or engraved — no need to redraw artwork in a proprietary format.",
    ],
    applications: [
      "Signage and advertising fabrication",
      "Acrylic display and point-of-sale fabrication",
      "Packaging die-line sampling and prototyping",
      "Furniture and woodworking decorative inlay",
      "Leather goods and footwear component cutting",
      "Gift, award and trophy engraving",
      "Rubber stamp making",
      "Textile and garment pattern cutting",
    ],
    comparisonSpecs: [
      "Laser power",
      "Working area",
      "Laser source type",
      "Positioning accuracy",
      "Max cutting/engraving speed",
      "Power supply",
    ],
    faqs: [
      {
        q: "Can the RA-C1390 cut metal?",
        a: "No, a 130 W class CO2 laser does not have the power density to cut through structural metal sheet; that is the role of our fiber laser range. The RA-C1390 can perform surface marking and light engraving on suitably prepared or coated metal for identification, branding or nameplate work, which is a distinct process from cutting through material.",
      },
      {
        q: "What is the maximum acrylic and MDF thickness it can cut?",
        a: "The RA-C1390 cuts acrylic up to around 20 mm and plywood or MDF up to a similar thickness in a single pass, with thicker stock cuttable in multiple passes at reduced speed. Exact achievable thickness depends on the specific material grade, so we recommend a sample test cut for unusual materials before committing to a production run.",
      },
      {
        q: "What design software works with the machine's controller?",
        a: "The controller accepts standard vector formats exported from common design and CAD tools, letting you send existing artwork to the machine directly. Layer or colour-based settings within the file control which lines are cut through, scored, or engraved at a lighter setting, so a single file can combine multiple operations in one job.",
      },
      {
        q: "How often does the laser tube need replacing?",
        a: "A sealed CO2 glass tube has a rated service life, typically several thousand hours of operation, after which output power gradually degrades and cut quality on thicker material declines. Replacement interval depends on daily usage; we advise on expected tube life and replacement cost at the time of purchase based on your production volume.",
      },
      {
        q: "Does the machine need special ventilation?",
        a: "Yes. Cutting acrylic, wood, leather and similar materials produces fumes and fine particulate that should be extracted, so we recommend fitting an exhaust or fume extraction system ducted outside the workspace, particularly for continuous production use. We can advise on extraction sizing appropriate to your workspace during installation planning.",
      },
      {
        q: "Is training included, and how long does it take to learn?",
        a: "Yes, operator training is included covering safe operation, focus and lens care, software use and routine maintenance. Most operators with basic computer familiarity become comfortable running standard jobs within one to two days of hands-on training, with more advanced nesting and multi-layer job setup picked up over the following weeks of regular use.",
      },
    ],
    image: { src: "/categories/co2-laser-machines.webp", alt: "CO2 laser machine cutting acrylic sheet for signage", width: 1200, height: 800 },
  },
  {
    slug: "robotic-welding-systems",
    name: "Robotic Welding Systems",
    shortName: "Robotic Welding",
    description:
      "Robotic MIG/MAG welding cells and workstations for consistent, high-volume weld quality across steel, stainless and aluminium fabrication.",
    intro:
      "Robotic welding systems bring industrial robot arms together with MIG/MAG welding power sources and positioners to deliver weld quality and cycle time that stay consistent regardless of which operator loaded the part. Our range spans the single-station RA-RW6 six-axis welding cell for growing fabrication shops to the dual-station RA-RW10 workstation for higher-throughput, multi-shift production.",
    longCopy: [
      "A robotic welding system pairs a six-axis robot arm carrying a MIG/MAG torch with a digital wire feeder, an inverter-based power source, and a positioner that presents the workpiece at the correct angle. The robot follows a taught or offline-programmed path at a precisely repeatable speed, torch angle and stick-out distance — exactly the variables that cause weld quality to vary between manual welders across a shift.",
      "The single-station RA-RW6 suits moderate, varied production where an operator loads a part and the robot completes the cycle before the next load. The dual-station RA-RW10 lets an operator load one station while the robot welds the other, roughly doubling throughput for shops running repeat batches.",
      "Mild and carbon steel, stainless steel and aluminium alloys all weld reliably using synergic modes programmed into our power sources. Aluminium benefits most from a robot's consistency, since manual aluminium MIG is notoriously sensitive to travel speed and torch angle; a programmed cell reduces burn-through and porosity defects.",
      "Each positioner has a maximum part size, weight and reach the robot can service without repositioning the fixture. For larger or irregular parts, we advise on a custom fixture design at the quotation stage so the cell is specified to your actual product range.",
      "Both the RA-RW6 and RA-RW10 support teach-pendant programming as standard, with offline programming from a CAD model available for shops running frequent new part introductions without taking the robot out of production.",
      "Each cell ships with a fenced enclosure, interlocked access doors and light curtains that stop the robot if the work envelope is entered mid-cycle, plus welding fume extraction sized to your part volume and material.",
    ],
    applications: [
      "Material handling equipment fabrication",
      "Structural steel brackets and sub-frame welding",
      "Agricultural implement fabrication",
      "Tank and pressure vessel welding",
      "Furniture and storage rack fabrication",
      "Construction equipment component welding",
      "Automotive chassis sub-assembly welding",
      "HVAC and ducting component welding",
    ],
    comparisonSpecs: [
      "Number of axes",
      "Repeatability",
      "Max reach",
      "Welding process",
      "Power source rating",
      "Power supply",
      "Machine weight",
    ],
    faqs: [
      {
        q: "Do I need a skilled welder to operate a robotic welding cell?",
        a: "Basic operation, loading parts and starting a saved welding program does not require a certified welder, but programming new welds and adjusting parameters benefits from someone with welding process knowledge. Many customers retrain an experienced manual welder as the cell's programmer and operator, combining their weld-quality judgment with the robot's consistency.",
      },
      {
        q: "What is the difference between the RA-RW6 and RA-RW10?",
        a: "The RA-RW6 is a single-station cell suited to moderate, varied production, where an operator loads a part and the robot completes the cycle before the next load. The RA-RW10 is a dual-station workstation that lets an operator load one station while the robot welds the other, roughly doubling throughput for shops running repeat batches.",
      },
      {
        q: "Can the robot weld aluminium as well as steel?",
        a: "Yes, both cells support MIG/MAG welding of mild steel, stainless steel and aluminium alloys, with synergic welding programs that automatically set voltage, wire speed and gas flow for the chosen material and wire diameter. Aluminium welding particularly benefits from the robot's consistent travel speed and torch angle compared with manual welding.",
      },
      {
        q: "How long does it take to program a new part?",
        a: "Teach-pendant programming for a straightforward new part typically takes from under an hour to half a day depending on weld count and joint complexity, and the saved program can be reused indefinitely for repeat batches. Offline programming from a CAD model can prepare more complex parts without taking the robot out of production.",
      },
      {
        q: "What safety features are included with the welding cell?",
        a: "Each cell is supplied with a fenced enclosure, interlocked access doors and safety light curtains that stop the robot immediately if the work envelope is entered during a cycle, along with welding fume extraction sized to your part volume. Installation includes commissioning these safety systems and testing them before handover.",
      },
      {
        q: "What ongoing maintenance does a robotic welding cell need?",
        a: "Routine maintenance covers the wire feeder's drive rollers and liner, the welding torch's contact tips and nozzles, robot axis lubrication per the manufacturer's schedule, and periodic calibration checks on the positioner. Our Annual Maintenance Contract plans cover scheduled preventive visits for robotic welding cells alongside our laser cutting machine range.",
      },
    ],
    image: { src: "/categories/robotic-welding-systems.webp", alt: "Six-axis robot arm MIG welding a steel bracket assembly", width: 1200, height: 800 },
  },
];

/** Look up a category by slug (undefined if unknown). */
export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
