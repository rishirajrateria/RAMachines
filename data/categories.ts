/**
 * data/categories.ts — RA Machine's five machine families, each with the
 * buyer-education copy shown on its /products/[category] page:
 *   1. CNC fiber laser cutting (1.5–30 kW; source can also be fitted for welding)
 *   2. CNC plasma cutting (100–200 A, cutting range 2–25 mm)
 *   3. MIG / TIG / MMA arc welding (220 V and 440 V, customisable)
 *   4. Submerged arc welding (440 V, customisable)
 *   5. Cobot and industrial robotic welding (configured to the buyer's brief)
 * There are no individual models: each family is configured to the buyer's job.
 *
 * CLIENT FIGURES ONLY. The only numbers this file may state are the ones
 * RA Machine supplied (kW, A, mm cutting range, V) — they live in `ranges`
 * and `headline`. Prose explains how each technology works and how to choose,
 * using general industry facts without RA-specific numbers: no bed sizes,
 * thickness per power level, speeds, accuracy, duty cycle, axes, reach,
 * payload, lead times, warranty terms or prices, and no model numbers.
 *
 * To edit: change the fields below. `description` ≤155 characters;
 * `longCopy` is an array of paragraphs, 350–500 words total (ADR-0003);
 * `faqs` are 6 per family, each answer 40–90 words.
 * To add a family: add its CategorySlug in data/types.ts first (owned by the
 * integration owner), then add its entry here.
 */
import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "fiber-laser-cutting-machines",
    name: "CNC Fiber Laser Cutting Machines",
    shortName: "CNC Laser",
    headline: "1.5–30 kW",
    headlineLabel: "laser power",
    ranges: [
      { label: "Laser power", value: "1.5 kW – 30 kW" },
      { label: "Process", value: "Cutting; laser can also be fitted for welding" },
    ],
    description:
      "CNC fiber laser cutting machines from 1.5 kW to 30 kW, engineered and built in India for sheet and plate fabrication. Installation and training included.",
    intro:
      "A CNC fiber laser cutting machine uses a focused, high-power beam from a solid-state fiber laser source to cut carbon steel, stainless steel, aluminium and other metals with a narrow kerf, little heat distortion and edges that rarely need further finishing. RA Machine builds fiber laser machines with sources from 1.5 kW to 30 kW, so a job shop cutting thin sheet and a heavy fabricator cutting thick plate can each have a machine configured to their material, thickness and daily output. Where the job calls for it, the same laser source can be fitted for welding instead of cutting.",
    longCopy: [
      "A fiber laser generates its beam inside an optical fibre pumped by laser diodes, then carries it through a flexible fibre cable to a cutting head that a CNC-controlled gantry moves over the sheet. A lens focuses the beam to a small spot that melts the metal, and a jet of assist gas blows the molten material out of the kerf. Unlike CO2 lasers, which build the beam in a gas-filled resonator and steer it with mirrors, fiber lasers convert electrical power to light far more efficiently and have no beam-path mirrors to align, which keeps running cost and routine maintenance low.",
      "Laser power is the first decision, and it should follow your work rather than assume bigger is better. Higher power cuts thicker plate and cuts thin sheet faster, but it also raises the cost of the source, the chiller and the electrical connection. A shop cutting mostly thin and medium sheet is usually well served towards the lower end of the 1.5–30 kW range; heavy engineering, plate processing and high-volume production, where cycle time sets output, justify more. We size the source to the thickest material you cut regularly, not the occasional exception, and to the hours the machine will run each day.",
      "The rest of the machine is configured around the same job: a working area to suit the sheets you buy, the cutting head, and the nesting software that lays parts out on each sheet to keep scrap low.",
      "Carbon steel is usually cut with oxygen, which reacts with the hot metal and helps on thicker plate. Stainless steel and aluminium are cut with nitrogen for a bright, oxide-free edge that can go straight to welding or powder coating, while compressed air is a lower-cost option for thinner, less critical parts. Reflective metals such as brass and copper can be cut too, provided the source and head are specified with back-reflection protection.",
      "Day-to-day running cost is mostly electricity, assist gas and consumables such as nozzles and protective windows. The source and cutting head need a closed-loop water chiller to keep beam quality stable, and the cutting area needs fume extraction. Against those costs, a laser removes most of the grinding, drilling and marking-out that slower cutting methods leave behind.",
      "Laser or plasma? A fiber laser gives finer detail, smaller holes, a narrower kerf and squarer edges, which matters for precision parts, close-fitting assemblies and visible finishes. CNC plasma costs less to buy and run and handles mild steel plate well where edge finish is less critical. Many fabricators start with plasma for structural plate and add a laser as precision work grows; we will tell you plainly which one your parts need.",
      "Every RA Machine fiber laser is engineered, built and tested in India and configured to the buyer's job before it leaves the workshop. Installation, commissioning and operator training are part of the supply, with spares, remote diagnostics and service visits afterwards.",
    ],
    applications: [
      "Sheet metal fabrication and job work",
      "Automobile and auto component manufacturing",
      "Electrical enclosures, control panels and switchgear",
      "Elevator and escalator panel fabrication",
      "Kitchen equipment and commercial appliance manufacturing",
      "HVAC ducting and ventilation components",
      "Structural steel and heavy engineering fabrication",
      "Agricultural equipment and implement manufacturing",
      "Railway coach and rolling stock components",
      "Architectural metalwork and metal signage",
    ],
    faqs: [
      {
        q: "How do I choose the right laser power between 1.5 kW and 30 kW?",
        a: "Start with the thickest material you cut regularly and the volume you need each shift. Higher power cuts thicker plate and cuts thin sheet faster, but it raises the cost of the source, chiller and electrical supply. Buying far more power than your work needs ties up capital; buying too little slows production. Share sample drawings and your material mix, and we will recommend a power level within the range and explain the reasoning.",
      },
      {
        q: "Which assist gas should I use for fiber laser cutting?",
        a: "Oxygen is generally used for carbon steel because it reacts with the hot metal and helps the cut on thicker plate. Nitrogen produces a clean, oxide-free edge on stainless steel and aluminium, ready for welding or a visible finish without further grinding. Compressed air is a lower-cost option for thinner, less critical parts. We set up the gas supply and cutting parameters for your materials during commissioning.",
      },
      {
        q: "Do fiber laser cutting machines need a chiller?",
        a: "Yes. The laser source and cutting head generate heat that must be removed to keep beam quality stable and protect the optics, so every fiber laser runs with a dedicated industrial water chiller sized to the laser power. It works as a closed loop and needs periodic coolant and filter checks, which are covered in operator training along with the machine's other routine maintenance tasks.",
      },
      {
        q: "Can the laser be used for welding as well as cutting?",
        a: "Yes. The laser source can be fitted for cutting or for welding, depending on what the job needs. Laser welding produces a narrow, low-distortion weld at high travel speed and suits thin sheet, stainless steel and joints where appearance matters. Tell us whether you need cutting, welding or both, and we will configure the source, head and controls to suit your parts and production.",
      },
      {
        q: "Can one machine cut both thin sheet and thick plate well?",
        a: "Yes, within the capability of its laser power. The CNC control stores cutting parameters for each material and thickness, adjusting power, speed, focus and gas pressure automatically, so the same machine moves between thin sheet and heavier plate without separate equipment. The key is choosing a power level that covers the thickest material you cut regularly while staying economical on the thin work that makes up most jobs.",
      },
      {
        q: "What after-sales support comes with a fiber laser cutting machine?",
        a: "Installation, commissioning and operator training are part of every supply, so your team is cutting production parts with confidence before handover. Training covers safe operation, programming and nesting, assist-gas settings and the daily and weekly checks that keep cut quality consistent. After that, we provide spares, remote diagnostics and service visits for the machines we build, so problems are diagnosed quickly and production keeps moving.",
      },
    ],
    image: {
      src: "/categories/fiber-laser-cutting-machines.webp",
      alt: "CNC fiber laser cutting machine cutting parts from a steel sheet",
      width: 1200,
      height: 800,
    },
  },
  {
    slug: "cnc-plasma-cutting-machines",
    name: "CNC Plasma Cutting Machines",
    shortName: "CNC Plasma",
    headline: "100–200 A",
    headlineLabel: "plasma current",
    ranges: [
      { label: "Plasma current", value: "100 A – 200 A" },
      { label: "Cutting range", value: "2 mm – 25 mm" },
    ],
    description:
      "CNC plasma cutting machines from 100 A to 200 A, cutting metal from 2 mm to 25 mm. Engineered and built in India, with installation and operator training.",
    intro:
      "A CNC plasma cutting machine cuts electrically conductive metal with a constricted arc of ionised gas, guided along a programmed path by a CNC gantry. It is the economical way to cut mild steel, stainless steel and aluminium plate in quantity, where speed and running cost matter more than the fine detail of a laser. RA Machine builds CNC plasma machines with power sources from 100 A to 200 A and a cutting range of 2 mm to 25 mm, each configured to the plate sizes, thicknesses and volumes of the buyer's workshop.",
    longCopy: [
      "A plasma torch forces a gas, usually compressed air, through a narrow nozzle while an electric arc passes from the electrode to the workpiece. The arc heats the gas until it becomes plasma, hot enough to melt steel, and the gas flow blows the molten metal out of the cut. Because the workpiece forms part of the electrical circuit, plasma cuts any conductive metal: mild steel, stainless steel, aluminium, brass and copper. The CNC controller drives the torch along the programmed profile, and torch height control keeps the stand-off distance correct as the plate flexes or warps with heat.",
      "The power source current is the main configuration choice. A higher-current source cuts thicker plate and cuts mid-range thicknesses faster, while a lower-current source gives a narrower kerf and finer detail on thin sheet and costs less to buy and run. Within the 2–25 mm cutting range, the right current depends on where most of your work sits: a workshop cutting mainly thin and medium sheet does not need the top of the range, while one cutting heavier plate every day does. Gantry size, torch height control and nesting software are configured around the same job.",
      "Plasma leaves a slightly bevelled edge and a wider heat-affected zone than a laser, and small holes relative to plate thickness are hard to cut cleanly. For brackets, base plates, gussets, flanges and parts that will be welded or machined anyway, this rarely matters. The correct current, cutting speed, stand-off height and fresh consumables keep dross to a minimum, so parts need only light cleaning.",
      "Running costs are electricity, compressed air or other plasma gas, and consumables. The electrode and nozzle wear with every arc start and must be replaced regularly, and cut quality falls if they are run too long. Clean, dry air matters, so the supply needs proper filtration and moisture removal. A water table or downdraught table handles the fume and dust, which plasma produces more of than laser.",
      "Plasma or fiber laser? Plasma costs considerably less to buy, is simple to run and cuts mild steel plate across the 2–25 mm range quickly, which makes it the practical choice for structural fabrication, agricultural equipment and heavy engineering. A fiber laser wins when parts need fine detail, small holes, tight fits or clean, square edges on thinner sheet. Some workshops run both: plasma for heavier plate, laser for precision sheet work.",
      "RA Machine engineers, builds and tests its CNC plasma machines in India and configures each one to the buyer's plate sizes, materials and output. Installation, commissioning and operator training come with the machine, covering programming, nesting, consumable care and safe operation, with spares, remote diagnostics and service visits afterwards.",
    ],
    applications: [
      "Structural steel fabrication",
      "Base plates, gussets, brackets and flanges",
      "Agricultural implements and trailers",
      "Earthmoving and construction equipment components",
      "Truck body and trailer building",
      "Storage tanks, silos and hoppers",
      "HVAC ductwork and fittings",
      "Steel furniture and storage racks",
      "General plate cutting and job work",
    ],
    faqs: [
      {
        q: "Should I choose plasma or fiber laser?",
        a: "Choose plasma if most of your work is mild steel plate for structural, agricultural or heavy fabrication, where speed and low running cost matter more than fine detail. Choose a fiber laser if you cut thinner sheet, need small holes, tight-fitting parts or clean, square edges for visible finishes. Plasma costs considerably less to buy. Share your drawings and material mix and we will recommend the technology that suits them.",
      },
      {
        q: "What thickness can a 100 A vs a 200 A plasma cut?",
        a: "Both work within the stated cutting range of 2 mm to 25 mm. As a rule, a higher-current source cuts thicker plate and cuts mid-range thicknesses faster, while a lower-current source gives finer detail and a narrower kerf on thin sheet. The right choice depends on the thicknesses you cut most often, the material and the edge quality you need, so we recommend a current after reviewing your drawings.",
      },
      {
        q: "Which metals can a CNC plasma machine cut?",
        a: "Plasma cuts any electrically conductive metal, because the workpiece forms part of the arc circuit. That includes mild steel, stainless steel, aluminium, galvanised sheet, brass and copper. Mild steel is the most common use. Stainless steel and aluminium cut well but benefit from correct gas selection and parameters for a clean edge. Plasma cannot cut non-conductive materials such as wood, plastics or glass.",
      },
      {
        q: "What consumables does plasma cutting use, and when are they changed?",
        a: "The main consumables are the electrode and nozzle, with the swirl ring and shield replaced less often. They wear with every arc start and with time under the arc, so life depends on how many pierces and how much cutting your jobs involve. Signs of wear include a wider, more bevelled cut and more dross. Operator training covers inspecting and changing consumables before quality drops.",
      },
      {
        q: "Does CNC plasma need compressed air or special gases?",
        a: "Most mild steel cutting is done with compressed air, which keeps running cost low. The air must be clean and dry, because oil and moisture shorten consumable life and spoil the cut, so the supply needs proper filtration and a dryer. Other plasma gases can improve edge quality on stainless steel and aluminium. We advise on the gas setup when configuring the machine for your materials.",
      },
      {
        q: "Are installation and operator training included?",
        a: "Yes. Every CNC plasma machine is installed and commissioned by our team, including torch height control setup, cutting parameter tables for your materials and a check of your air supply. Operator training covers programming and nesting, consumable care, safe operation and routine maintenance. After handover, we provide spares, remote diagnostics and service visits for the machines we build, so your cutting keeps running.",
      },
    ],
    image: {
      src: "/categories/cnc-plasma-cutting-machines.webp",
      alt: "CNC plasma cutting machine cutting a profile from steel plate",
      width: 1200,
      height: 800,
    },
  },
  {
    slug: "mig-tig-arc-welding-machines",
    name: "MIG, TIG & Arc (MMA) Welding Machines",
    shortName: "MIG / TIG / MMA",
    headline: "MIG · TIG · MMA",
    headlineLabel: "processes",
    ranges: [
      { label: "Processes", value: "MIG, TIG, MMA (arc)" },
      { label: "Supply", value: "220 V and 440 V" },
      { label: "Configuration", value: "Customisable" },
    ],
    description:
      "MIG, TIG and MMA arc welding machines for 220 V and 440 V supply, customisable to your work. Engineered and built in India, with installation and training.",
    intro:
      "Arc welding joins metal by melting the joint with an electric arc, and the three most widely used manual and semi-automatic processes are MIG, TIG and MMA (stick). RA Machine builds welding machines for all three, for 220 V and 440 V supply, and customises each to the buyer's materials, thicknesses and type of work. That covers a fabrication shop's everyday MIG set, a TIG machine for stainless steel and aluminium, and a rugged MMA machine for site erection and maintenance, each engineered, built and tested in India.",
    longCopy: [
      "All three processes strike an arc between an electrode and the workpiece and protect the molten weld pool from the air. They differ in how filler metal is supplied and how the pool is shielded, and that difference decides speed, the skill required, weld appearance and where each process works best.",
      "MIG (metal inert gas) welding, called MAG when an active gas mixture is used on steel, feeds a continuous wire electrode through the torch while shielding gas flows around the arc. Because the welder never stops to change electrodes, it is the fastest of the three for production fabrication on mild steel, stainless steel and aluminium, and the easiest to learn. It needs a gas cylinder and is sensitive to wind, so it is mainly a workshop process.",
      "TIG (tungsten inert gas) welding uses a non-consumable tungsten electrode and, where needed, a separately fed filler rod, shielded by argon. It is slower and demands more operator skill, but it gives precise heat control and clean, spatter-free welds. That makes it the choice for thin stainless steel, aluminium, food and pharmaceutical equipment, pipe root passes and any weld that will be seen.",
      "MMA (manual metal arc, or stick) welding uses a flux-coated electrode whose coating creates its own shielding gas and slag. It needs no gas cylinder and copes with wind, mill scale and awkward positions better than the other two, so it remains the standard for site erection, structural work, repair and maintenance. It is slower than MIG because of electrode changes and slag removal between runs.",
      "Choosing a configuration starts with the job: the processes you need, the metals and thicknesses, how long the machine will weld without a break, and the supply available. A 220 V machine runs from an ordinary single-phase connection and suits smaller workshops, maintenance teams and site use; a 440 V three-phase machine suits continuous production and heavier sections. Many buyers want one machine that covers more than one process, and we customise the output, controls, torches and accessories to suit.",
      "These machines sit alongside the other welding families on this site. For long, straight or circumferential seams on thick plate, submerged arc welding deposits metal faster than manual MIG. For repeat parts in volume, a cobot or industrial robot can carry the MIG torch and weld every part the same way. Manual MIG, TIG and MMA remain the right tools for varied, one-off and site work.",
      "RA Machine engineers, builds and tests its welding machines in India and supports them with installation, operator training, spares, remote diagnostics and service visits.",
    ],
    applications: [
      "Structural steel and general fabrication",
      "Stainless steel food, dairy and pharmaceutical equipment",
      "Aluminium fabrication",
      "Pipe and pipeline welding",
      "Automobile body and component repair",
      "Agricultural equipment manufacture and repair",
      "Site erection and construction",
      "Plant maintenance and repair workshops",
      "Steel gates, grills and furniture",
      "Welding training at ITIs and technical institutes",
    ],
    faqs: [
      {
        q: "What is the difference between MIG, TIG and MMA welding?",
        a: "MIG feeds a continuous wire through the torch with shielding gas, making it the fastest and easiest for production fabrication. TIG uses a tungsten electrode and separate filler rod under argon, giving the cleanest, most controlled welds on thin stainless steel and aluminium, but it is slower and needs more skill. MMA uses flux-coated stick electrodes, needs no gas cylinder and is the most forgiving for site and repair work.",
      },
      {
        q: "Should I buy a 220 V or a 440 V welding machine?",
        a: "It depends on the supply at your site and the work you do. A 220 V machine runs from an ordinary single-phase connection, so it suits smaller workshops, maintenance teams and work where the machine moves around. A 440 V three-phase machine suits continuous production welding and heavier sections, where the machine runs for long periods. Tell us your supply and typical jobs, and we will recommend the right option.",
      },
      {
        q: "Which welding process suits stainless steel and aluminium?",
        a: "TIG gives the most precise control and the cleanest finish on thin stainless steel and aluminium, which is why it is used for food, dairy, pharmaceutical and decorative work. MIG is faster and well suited to thicker sections and production runs in both metals, with the right wire and shielding gas. MMA can weld stainless steel with suitable electrodes but is rarely the first choice for aluminium. We configure the machine to the metals you weld.",
      },
      {
        q: "Can one machine do MIG, TIG and MMA?",
        a: "We can configure a machine for more than one process, which suits workshops doing varied work that do not want separate sets for each job. A multi-process machine is practical where one process dominates and the others are used occasionally. Where a workshop welds all day in one process, a dedicated machine is often simpler. We look at your work mix and recommend the arrangement that makes sense.",
      },
      {
        q: "What does 'customisable' mean for a welding machine?",
        a: "It means the machine is configured to your work rather than picked from a fixed catalogue. We match the processes, output, supply voltage, controls, torches, cables, wire feeder and accessories to the metals and thicknesses you weld and how long the machine runs. Share your typical jobs, materials and the supply at your site, and we will propose a configuration and explain why it suits that work.",
      },
      {
        q: "Is MMA still worth buying when MIG is faster?",
        a: "Yes, for the right work. MMA needs no gas cylinder or wire feeder, so the equipment is simple, portable and tolerant of wind, rust and awkward positions. That makes it the practical choice for site erection, structural steel, repairs and maintenance, where moving a MIG set and gas supply is inconvenient. For production welding in a workshop, MIG is usually faster and more economical per metre of weld.",
      },
    ],
    image: {
      src: "/categories/mig-tig-arc-welding-machines.webp",
      alt: "Arc welding machine with MIG torch welding a steel joint",
      width: 1200,
      height: 800,
    },
  },
  {
    slug: "submerged-arc-welding-machines",
    name: "Submerged Arc Welding (SAW) Machines",
    shortName: "SAW",
    headline: "440 V",
    headlineLabel: "supply",
    ranges: [
      { label: "Supply", value: "440 V" },
      { label: "Configuration", value: "Customisable" },
    ],
    description:
      "Submerged arc welding (SAW) machines for 440 V, customisable for long seams on thick plate. Engineered and built in India, with installation and training.",
    intro:
      "Submerged arc welding (SAW) is an automatic process in which the arc burns under a blanket of granular flux, fed by a continuous wire electrode. It deposits weld metal quickly with deep penetration, a smooth bead and almost no visible arc, spatter or fume, which makes it the standard method for long seams on thick plate. RA Machine builds SAW machines for 440 V supply and customises each to the buyer's work: the type of seam, the size of the job, and how the welding head and workpiece are to move.",
    longCopy: [
      "In submerged arc welding, a wire electrode is fed continuously from a spool into the joint while a hopper lays granular flux ahead of it. The arc forms between the wire and the workpiece beneath that flux layer. The flux melts to shield the weld pool and forms a slag that protects the bead as it cools, and the unmelted flux is recovered and reused. Because the arc is buried, there is no visible arc flash and very little spatter or fume, and the welding head travels at a steady, mechanised speed.",
      "SAW beats MIG on long, straight or circumferential seams in thick material. It deposits far more weld metal per hour, penetrates deeply so thick joints need fewer passes, and produces consistent, smooth beads that need little cleaning. MIG remains the better choice for short welds, complex shapes, thin sheet and vertical or overhead positions, because SAW works only in the flat position, or on horizontal fillets, where the flux can lie on the joint.",
      "A SAW machine is less a single welding set than a system: the power source, the wire feeder and welding head, flux handling and recovery, and the equipment that moves either the head or the work. Longitudinal seams are usually welded with a tractor running along the joint or a column-and-boom carrying the head; circumferential seams on shells and pipes use rotators or positioners turning the work beneath a fixed head. The job decides which of these you need and the size of work they must handle.",
      "SAW is used mainly on carbon and low-alloy steels, and also on stainless steel with matching wire and flux. Wire and flux are chosen together to give the weld chemistry and toughness the job requires, which is why pressure vessel and structural fabricators specify them carefully. Joint preparation and fit-up matter, because SAW rewards clean, well-aligned joints.",
      "The machine runs on 440 V three-phase supply, which suits the continuous, high-output welding SAW is used for. Running costs are electricity, wire and flux, reduced by reusing recovered flux. Because the operator supervises the weld rather than holding a torch, fatigue is lower and quality depends far less on individual hand skill.",
      "RA Machine engineers, builds and tests its SAW machines in India and customises each to the buyer's seams, job sizes and handling equipment. Installation, commissioning and operator training are part of the supply, covering parameter setting, flux handling and safe operation, with spares, remote diagnostics and service visits afterwards. For shorter welds and general fabrication, our MIG, TIG and MMA machines are the better fit.",
    ],
    applications: [
      "Pressure vessels and boilers",
      "Storage tanks and silos",
      "Large-diameter pipe fabrication",
      "Structural beams, columns and plate girders",
      "Wind tower sections",
      "Shipbuilding and barge panels",
      "Railway wagon fabrication",
      "Heavy engineering and earthmoving equipment",
      "Hardfacing and build-up of worn rollers and shafts",
    ],
    faqs: [
      {
        q: "What jobs is SAW best for?",
        a: "SAW suits long, continuous welds on thick steel: longitudinal and circumferential seams on pressure vessels, boilers, tanks and pipes, and the web-to-flange joints of beams, columns and plate girders. It also suits hardfacing and build-up of worn rollers and shafts. Wherever the same long seam is welded repeatedly in the flat position, SAW delivers high deposition and consistent quality with little cleaning afterwards.",
      },
      {
        q: "Does SAW work on 440 V three-phase supply?",
        a: "Yes. RA Machine's SAW machines are built for 440 V supply, the three-phase industrial connection most Indian factories already have. SAW draws heavy current for long periods, so a three-phase supply is the practical choice. Before installation we check your incoming supply, cabling and earthing so the machine runs reliably. If your site has a different arrangement, tell us at the enquiry stage, because the configuration is customisable.",
      },
      {
        q: "When should I choose SAW instead of MIG welding?",
        a: "Choose SAW when your work involves long seams on thick plate that can be welded in the flat position, and when the volume justifies a mechanised setup. It deposits metal faster, penetrates deeper and gives smoother, more consistent beads than manual MIG. Choose MIG for short welds, complex shapes, thinner material and positional welding, where SAW's flux blanket and travel equipment are impractical.",
      },
      {
        q: "Can submerged arc welding be done in all positions?",
        a: "No. Because the arc is buried under loose granular flux, SAW is limited to the flat position and horizontal fillet welds, where gravity keeps the flux on the joint. Circumferential seams are welded flat by turning the work on rotators beneath a fixed head. Vertical and overhead welds are better done with MIG, TIG or MMA, which is why most fabrication shops use SAW alongside them.",
      },
      {
        q: "What is the flux for, and can it be reused?",
        a: "The flux shields the arc and weld pool from the air, adds alloying elements in some grades, and forms a slag that protects the bead as it cools. Only part of it melts. The unmelted flux is collected, usually by a recovery system, sieved and returned to the hopper. It must be kept dry, because moisture causes porosity, so storage and handling are covered in training.",
      },
      {
        q: "What equipment do I need around a SAW machine?",
        a: "That depends on the seams you weld. Longitudinal seams usually need a welding tractor or a column-and-boom to carry the head along the joint. Circumferential seams need rotators or a positioner to turn the shell or pipe beneath the head. Flux recovery and fixtures complete the setup. We customise the system to your job sizes and include installation, commissioning and operator training with it.",
      },
    ],
    image: {
      src: "/categories/submerged-arc-welding-machines.webp",
      alt: "Submerged arc welding head running a long seam on thick steel plate under granular flux",
      width: 1200,
      height: 800,
    },
  },
  {
    slug: "robotic-welding-systems",
    name: "Cobot & Robotic Welding Systems",
    shortName: "Cobot / Robot",
    headline: "Built to brief",
    headlineLabel: "configuration",
    ranges: [
      { label: "Type", value: "Collaborative robot (cobot) or industrial robot" },
      { label: "Configuration", value: "As per the buyer's requirement" },
    ],
    description:
      "Cobot and industrial robotic welding systems, configured to your parts and volumes. Engineered and built in India, with installation and operator training.",
    intro:
      "A robotic welding system carries the welding torch on a programmable arm, so every part is welded with the same path, speed and torch angle regardless of who loaded it. RA Machine supplies two kinds: collaborative robots (cobots), which work alongside people and are quick to teach, and industrial robots, which run in guarded cells for higher speed and volume. There is no fixed model list. Each system is configured as per the buyer's requirement: the parts, the welding process, the fixtures and the output needed.",
    longCopy: [
      "A robotic welding system pairs a robot arm carrying the torch with a welding power source, a wire feeder for MIG work, and fixtures or a positioner that hold the part in the right place and at the right angle. The robot follows a taught path at a repeatable speed, torch angle and stick-out, which are exactly the variables that make manual weld quality vary from welder to welder and through a long shift.",
      "Cobots are designed to share space with people. Force sensing and speed limits let them work without full guarding where a risk assessment confirms the application is safe, and most are taught by hand-guiding the torch to each point and saving it on a tablet. That suits small and medium batches, frequent changeovers and shops automating welding for the first time. Industrial robots are faster, more rigid and built to run continuously. They work inside a guarded cell with interlocked doors and light curtains, and suit high volumes of repeat parts and layouts where one station is loaded while the robot welds another.",
      "The configuration is decided by the work: the size and weight of the parts, the length and position of the welds, batch sizes and how often the part changes, the welding process, and the output you need per shift. Fixtures matter as much as the robot. A robot welds exactly where it was taught, so parts must be cut and fitted consistently; accurate blanks from a CNC laser or plasma machine and well-designed fixtures are what make a robot pay off. We design fixtures and positioners around your actual parts.",
      "Robotic MIG/MAG welding of mild steel, stainless steel and aluminium is the most common application, using synergic programs that set wire speed and voltage together. Aluminium benefits most from a robot's consistency, because manual aluminium MIG is sensitive to travel speed and torch angle. TIG can also be automated where the job needs clean welds on thinner stainless steel.",
      "A robot does not remove the need for welding knowledge. Loading parts and running a saved program needs no certified welder, but programming and setting parameters benefit from someone who understands welding, and many shops retrain an experienced welder as the robot's programmer. Routine care covers contact tips, nozzles and liners, torch cleaning, cable checks and the lubrication schedule set by the robot's maker. Fume extraction belongs in every setup.",
      "Against the other technologies on this site, manual MIG, TIG and MMA machines remain the right tools for one-off and varied work, and SAW handles long seams on thick plate. Robotic systems take over repeat parts where consistency and throughput matter. RA Machine engineers each system to the buyer's brief, builds and tests it in India, and supports it with installation, commissioning, operator and programmer training, spares, remote diagnostics and service visits.",
    ],
    applications: [
      "Automobile and auto component sub-assemblies",
      "Two-wheeler frames and components",
      "Agricultural implement fabrication",
      "Construction and earthmoving equipment components",
      "Material handling equipment fabrication",
      "Structural brackets and sub-frames",
      "Steel furniture and storage racks",
      "Electrical enclosures and panel frames",
      "HVAC and ducting components",
    ],
    faqs: [
      {
        q: "What's the difference between a cobot and an industrial welding robot?",
        a: "A cobot is built to work near people: it senses contact, runs at limited speed and is usually taught by hand-guiding the torch, so it suits small batches, frequent changeovers and first-time automation. An industrial robot is faster and more rigid, runs inside a guarded cell, and suits high volumes of repeat parts. We recommend one or the other after looking at your parts, batch sizes and output.",
      },
      {
        q: "Is my production volume high enough for robotic welding?",
        a: "Robotic welding pays off when the same parts recur, even in modest batches, and when consistent weld quality or a shortage of skilled welders is holding production back. Cobots make sense at lower volumes because they are quick to teach and change over. Very varied one-off work is usually better done manually. Share your part drawings and monthly quantities, and we will give you an honest assessment.",
      },
      {
        q: "Do I need a skilled welder to operate a robotic welding system?",
        a: "Loading parts and starting a saved program does not need a certified welder, but programming new welds and adjusting parameters benefits from someone with welding process knowledge. Many customers retrain an experienced manual welder as the system's programmer and operator, combining their judgement of weld quality with the robot's consistency. Our training covers both operating the system and programming new parts.",
      },
      {
        q: "Can a robot weld stainless steel and aluminium as well as mild steel?",
        a: "Yes. Robotic MIG/MAG welding handles mild steel, stainless steel and aluminium alloys, with synergic programs that set wire speed and voltage for the chosen material and wire. Aluminium benefits particularly from a robot's steady travel speed and torch angle, which reduce burn-through and porosity compared with manual welding. TIG can also be automated where the job needs clean welds on thinner stainless steel.",
      },
      {
        q: "Why do parts and fixtures matter so much for robotic welding?",
        a: "A robot repeats the taught path exactly, so it cannot compensate the way a manual welder does for a part that is cut short or fitted with a gap. Consistent blanks, ideally from CNC laser or plasma cutting, and fixtures that locate every part in the same place are what make a robot weld reliably. We design the fixtures and positioners around your actual parts as part of the system.",
      },
      {
        q: "What safety measures does a robotic welding system need?",
        a: "An industrial robot works inside a guarded cell with interlocked doors and light curtains that stop it if anyone enters during a cycle. A cobot can work without full guarding only where a risk assessment of the specific application confirms it is safe, and the welding arc still needs screening. Both need welding fume extraction. We commission and test the safety systems before handover.",
      },
    ],
    image: {
      src: "/categories/robotic-welding-systems.webp",
      alt: "Robot arm MIG welding a steel assembly held in a fixture",
      width: 1200,
      height: 800,
    },
  },
];

/** Look up a category by slug (undefined if unknown). */
export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
