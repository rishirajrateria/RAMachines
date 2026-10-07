/**
 * data/guides/preparing-factory-for-cnc-machine.ts — buyer guide on site
 * preparation for a CNC cutting or welding machine (power, earthing, air, gas,
 * floor, chiller, fume extraction, access, people). General practice only;
 * exact figures for any machine are confirmed with the buyer for their specific order.
 */
import type { Guide } from "../types";

export const guide: Guide = {
  slug: "preparing-factory-for-cnc-machine",
  title: "CNC Machine Site Preparation: How to Prepare Your Factory",
  description:
    "Site preparation for a CNC laser, plasma or welding machine: power, earthing, compressed air, gas storage, floor, chiller, fume extraction and access.",
  h1: "How to Prepare Your Factory for a CNC Cutting or Welding Machine",
  summary:
    "Prepare the site while the machine is being built: a correctly rated three-phase supply with proper earthing and stable voltage, clean dry compressed air, safe storage for assist or shielding gases, a level floor that can carry the machine, room for the chiller and fume extraction, and clear crane or forklift access. The supplier's site-preparation note for your machine should give the exact figures.",
  sections: [
    {
      h2: "Why site preparation decides how installation day goes",
      paragraphs: [
        "Most delayed installations are not caused by the machine. They are caused by a cable that is too thin, an earth that was never tested, a gas supply that has not been ordered, or a crate that will not fit through the door. Each of these is cheap to fix in advance and expensive to fix with an engineer waiting on site.",
        "The good news is that the lead time on a new machine gives you weeks to get ready. Treat site preparation as its own small project with one owner, a checklist and a date, and start it as soon as the order is confirmed and you have the supplier's site-preparation note in hand.",
      ],
    },
    {
      h2: "Power supply, earthing and voltage stability",
      paragraphs: [
        "CNC cutting machines and industrial welding machines normally run on a three-phase supply, although some smaller welding machines run on single phase. Check that your connected or sanctioned load with the electricity utility can take the new machine together with everything else that runs at the same time, including the chiller, compressor and extraction. If it cannot, apply for an increase early, because utilities rarely move quickly.",
        "Run a dedicated feeder from the main panel to the machine, with cable sized by a qualified electrician for the load and the length of the run, and a lockable isolator close to the machine. CNC controls and laser sources are sensitive to poor earthing, so most suppliers ask for a dedicated earth electrode for the machine and a measured earth resistance within the figure they specify.",
        "Where the incoming voltage swings, which is common on industrial estates and at the end of long rural lines, a servo voltage stabiliser rated for the machine protects the electronics and keeps cutting and welding results consistent. Measure the supply at different times of day before deciding.",
      ],
      bullets: [
        "Supply voltage, phase and frequency measured at the panel",
        "Available capacity against the machine's rated load",
        "Dedicated feeder, correctly sized cable and a lockable isolator",
        "Dedicated, tested earth for the machine",
        "Stabiliser where voltage is unstable",
      ],
    },
    {
      h2: "Compressed air and gases",
      paragraphs: [
        "Fiber lasers cut with oxygen, nitrogen or compressed air as the assist gas. Air plasma cutters use compressed air as the plasma gas. In both cases the air must be clean, dry and free of oil, so plan for a suitable compressor, a refrigerated dryer and proper filtration rather than tapping into the general workshop line. Moisture and oil in the air shorten consumable life and spoil the cut.",
        "Welding machines need shielding gas: argon for TIG, and argon mixtures or carbon dioxide for MIG, depending on the material. Submerged arc welding uses flux instead of gas, so plan dry storage for the flux. Store cylinders upright, chained, in a ventilated place away from heat and the cutting area, and follow local rules on gas storage. In India, storing compressed gas cylinders beyond certain quantities needs a licence under the Gas Cylinders Rules, administered by PESO.",
        "If you expect to use a lot of nitrogen, ask your gas supplier about cylinder banks, a manifold or bulk liquid supply before the machine arrives.",
      ],
    },
    {
      h2: "Floor, layout and access",
      paragraphs: [
        "Cutting tables, gantries and welding positioners are heavy, and they need a floor that is level and strong enough not to settle under them. Avoid placing the machine across an expansion joint or a patched section of floor, and keep it away from presses or hammers that send vibration through the slab. If the floor is doubtful, ask a civil engineer to check it against the weight and footprint in the supplier's note; a new foundation takes time to cure.",
        "Plan the layout around material flow, not just the machine's footprint. Sheets or plates come in on one side, finished parts and offcuts leave on another, and the operator needs room to work safely.",
      ],
      bullets: [
        "Space to load full sheets or plates by crane or forklift",
        "Room to unload parts and remove scrap",
        "Clear access around the machine for maintenance",
        "A safe operator position with a view of the work",
        "Door width, headroom and route for the delivery crate",
      ],
    },
    {
      h2: "Chiller, fume extraction and the working environment",
      paragraphs: [
        "A fiber laser source and cutting head are cooled by a water chiller. Place it in a ventilated, shaded spot, not in direct sun or beside a furnace, and keep it close enough to the machine for the hoses supplied. Fill it only with the water quality the supplier specifies. Dust, heat and humidity also affect electronics, so keep the control cabinet clean and, in hot climates, consider whether it needs cooling.",
        "Laser and plasma cutting produce fumes and fine dust, and welding produces fumes that should not be breathed in. Plan local exhaust from the start: a ducted extraction unit for the cutting table, and fume extraction at the welding station or torch. Route the exhaust outside or through a filter in line with your local environmental and workplace rules. Plasma and welding arcs also give off strong ultraviolet light, so screen the area from other workers.",
      ],
    },
    {
      h2: "People, files and materials for handover",
      paragraphs: [
        "Choose the people who will run and maintain the machine before installation, and make sure they are free to attend the whole training rather than being called away to production. Operators who already read drawings and understand basic machine safety learn fastest.",
        "Have a computer ready for the nesting or programming software, a few real drawings in the format your software accepts, and enough of your own material in the thicknesses you cut most for trial cuts or welds. Put suitable fire extinguishers, first-aid provision and the right personal protective equipment in place before the first cut.",
      ],
    },
    {
      h2: "How RA Machine handles site preparation",
      paragraphs: [
        "Once an order is confirmed, RA Machine goes through what the specific machine you have ordered needs, covering its power, earthing, air, gas, floor and space. The 8 to 10 week lead time gives most buyers enough time to complete the work. If anything in the note does not fit your site, raise it before dispatch.",
        "Installation, commissioning and operator training are included with every machine. After handover, remote diagnostics respond within 4 working hours, with an engineer on site the next working day around Kolkata and within 48 hours elsewhere in India; visits outside India are subject to visa and travel arrangements. Warranty is 12 months, with customised extended warranty on request.",
      ],
    },
  ],
  faqs: [
    {
      q: "How much space does a CNC cutting machine need?",
      a: "More than its footprint. Allow for loading full sheets or plates, unloading parts and scrap, the chiller and extraction unit, a control desk, and clear access around the machine for maintenance. The exact footprint depends on the working area and configuration, so use the dimensions in the supplier's site-preparation note and mark the full layout on the floor before the machine arrives.",
    },
    {
      q: "Do I need a voltage stabiliser for a CNC laser or plasma machine?",
      a: "You need one if your incoming supply is unstable. Voltage dips and surges can trip drives, upset the controller and shorten the life of laser sources and power electronics. Have your electrician log the voltage at different times of day. If it moves outside the range the supplier specifies, fit a servo stabiliser rated for the machine's full load.",
    },
    {
      q: "Can I use my existing workshop compressor for laser or plasma cutting?",
      a: "Possibly, but check its capacity, pressure and air quality first. Cutting needs a steady supply at the specified pressure, and the air must be dry and oil-free. Many general workshop compressors deliver wet, oily air, which damages consumables and optics. A dedicated dryer and filter set, or a separate compressor, is often the cheaper option over a year of running.",
    },
    {
      q: "Does a CNC machine need a special foundation?",
      a: "Many machines sit on an existing industrial floor if it is level, sound and strong enough for the load. Heavier machines, weak or cracked floors, or sites next to vibrating equipment may need a dedicated foundation. Ask the supplier for the machine's weight and footprint, have a civil engineer assess your floor, and allow curing time if new concrete is needed.",
    },
    {
      q: "Who is responsible for site preparation, the buyer or the supplier?",
      a: "The buyer normally prepares the site, because it involves the building, the electricity connection and local contractors. The supplier's part is to tell you exactly what the machine needs, usually through a site-preparation note, and to answer questions from your electrician or civil contractor. Agree in writing what is ready before the installation engineer is booked to travel.",
    },
  ],
  families: [
    "fiber-laser-cutting-machines",
    "cnc-plasma-cutting-machines",
    "mig-tig-arc-welding-machines",
  ],
  related: [
    "cnc-machine-buying-checklist",
    "importing-cnc-machines-from-india",
    "welding-machine-220v-vs-440v",
  ],
  published: "2026-10-07",
  updated: "2026-10-07",
};
