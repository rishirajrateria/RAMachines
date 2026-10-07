import type { Guide } from "../types";

export const guide: Guide = {
  slug: "fiber-laser-power-guide",
  title: "Fiber Laser Power Guide: Choosing 1.5 kW to 30 kW",
  description:
    "How to choose fiber laser power from 1.5 kW to 30 kW: what extra kilowatts buy, what they cost to run, and how to size the source to your regular work.",
  h1: "How to Choose Fiber Laser Power (1.5 kW to 30 kW)",
  summary:
    "Size fiber laser power to the thickest material you cut regularly and the output you need each shift, not to the rare heavy job. More power cuts thicker plate and cuts sheet faster, but it raises the cost of the source, chiller, electrical supply and gas. Most sheet-metal shops sit towards the lower end; plate processors and high-volume producers justify more.",
  sections: [
    {
      h2: "What does more laser power actually change?",
      paragraphs: [
        "Laser power, measured in kilowatts, is the energy the source delivers to the cut. More energy lets the machine melt through thicker material, and on material it can already cut, it lets the head move faster. That is the whole case for a bigger source: a higher ceiling on thickness and more parts per hour.",
        "Power also changes piercing. Before every cut starts, the laser has to bore through the plate, and on thicker material that takes time. A higher-power source pierces faster, which matters on nests with many small parts and many pierces.",
        "What power does not change is the precision of the machine. Accuracy comes from the gantry, drives, cutting head and control. A well-built lower-power machine cuts thin parts just as accurately as a high-power one, and often with less risk of overheating small features.",
      ],
    },
    {
      h2: "Why size the source to your regular work, not the exception?",
      paragraphs: [
        "The most common mistake is buying power for the one heavy job a quarter. The price of the source, and of everything sized around it, is paid every day, while the thick-plate job arrives occasionally and can often be outsourced or cut by plasma.",
        "A better approach is to look at the last six to twelve months of work and ask which material and thickness make up most of the cutting time. Size the source to cut that comfortably at good quality, with some headroom, and then check whether the occasional heavier job can still be cut at an acceptable speed and finish.",
        "There is also a limit to how much speed extra power buys on thin sheet. On small, detailed parts, the head spends much of its time accelerating and slowing at corners, so the machine's motion, not its laser, sets the cycle time. Paying for kilowatts the gantry cannot use is money lost, so if your parts are small and intricate, a faster, well-tuned motion system may matter more than a bigger source.",
      ],
    },
    {
      h2: "How do workshops typically use different power levels?",
      paragraphs: [
        "The bands below are a broad industry pattern, not fixed limits. Where a particular job falls depends on the material, the assist gas and the edge quality you need, so treat them as a starting point for discussion.",
      ],
      bullets: [
        "Lower end of the range (around 1.5 to 3 kW): job shops, enclosures, panels, kitchen equipment and signage cutting mostly thin and medium sheet, where low purchase and running cost matter most.",
        "Middle of the range (roughly 4 to 12 kW): general fabricators cutting a mix of sheet and plate, who want noticeably faster sheet cutting and more headroom on thicker work.",
        "Upper end of the range (roughly 12 to 30 kW): plate processing, heavy engineering and high-volume production, where thick material is routine and cycle time sets output.",
        "Any band: if you plan to cut reflective metals such as copper and brass, the source and head must be specified for it, whatever the power.",
      ],
    },
    {
      h2: "How does assist gas affect the power you need?",
      paragraphs: [
        "The gas you cut with changes how hard the laser has to work. Cutting carbon steel with oxygen adds heat from the reaction between oxygen and hot iron, so thicker mild steel can be cut with less laser power, at the cost of a slower cut and an oxide layer on the edge.",
        "Cutting with nitrogen gives a clean, bright edge on stainless steel and aluminium, but the laser supplies all the melting energy and the gas only clears the kerf. Nitrogen cutting therefore benefits most from extra power, and it also uses a lot of gas at high pressure, which is a real running cost.",
        "Clean, dry compressed air is a cheaper alternative for many sheet jobs, and higher-power sources have made air cutting practical on a wider range of thicknesses. If your work is mostly stainless steel or aluminium with nitrogen, factor that into the power decision; if it is mostly mild steel with oxygen, you may need less power than you think.",
      ],
    },
    {
      h2: "What else grows with laser power?",
      paragraphs: [
        "The source is only part of the cost. When you compare quotations at different power levels, compare the complete installation rather than the machine price alone, because several other items have to grow with the laser:",
      ],
      bullets: [
        "The chiller, which must remove more heat to keep the source and cutting head stable.",
        "The electrical connection, which may need a larger supply, cabling and protection.",
        "The cutting head and optics, which must be rated for the power.",
        "Assist-gas supply, especially nitrogen flow and pressure for high-speed clean cutting.",
        "Fume extraction, because faster cutting of thicker plate produces more fume.",
        "The machine structure and bed, which must carry heavier plate and stay rigid at higher speeds.",
      ],
    },
    {
      h2: "Questions to answer before you choose",
      paragraphs: [
        "Before asking for a quotation, gather answers to a few practical questions. They make the power recommendation far more reliable than a guess based on the thickest plate you have ever cut: which materials you cut, and in what proportion; which thicknesses take up most of the machine time; whether edges must be oxide-free for welding or visible finishes; how many hours a day the machine will run; what electrical supply and gas arrangements your site has; and how you expect the work to change over the next few years.",
        "If the honest answer to the last question is uncertain, a machine sized for today's work with sensible headroom is usually a safer investment than one sized for a future that may not arrive.",
      ],
    },
    {
      h2: "How RA Machine sizes the laser for your job",
      paragraphs: [
        "RA Machine builds CNC fiber laser cutting machines with sources from 1.5 kW to 30 kW, and the same laser source can be fitted for welding where the job needs it. There are no fixed models: we review your drawings, materials and volumes and recommend a power level, explaining why.",
        "Installation, commissioning and operator training are included, covering cutting parameters, gas settings and routine care. After handover, we offer remote diagnostics within 4 working hours, stocked spares and on-site support, with a 12-month warranty and extended cover available on request.",
      ],
    },
  ],
  faqs: [
    {
      q: "Should I buy extra laser power for future growth?",
      a: "Some headroom is sensible, because a source running near its limit all day cuts more slowly and is less forgiving. Buying a much larger source for growth that has not yet arrived is riskier: you pay for the source, chiller and electrical supply now, and the extra capacity may sit idle for years. A clear plan, such as a confirmed contract for thicker plate, is a better reason to size up than general optimism.",
    },
    {
      q: "Does a high-power laser cut thin sheet worse?",
      a: "Not if it is set up properly. The control reduces power, adjusts focus and changes speed for each material and thickness, so a high-power machine can cut thin sheet cleanly. The drawback is economic rather than technical: on thin, detailed parts the machine's motion often limits speed, so much of the extra power goes unused while you still carry its higher purchase and running cost.",
    },
    {
      q: "Does higher laser power mean higher electricity bills?",
      a: "Generally yes, but not in direct proportion to the job. Fiber lasers convert electrical power to light efficiently, and the source only draws full power while cutting at full output. A larger source also needs a larger chiller, which adds to consumption. Because a higher-power machine finishes each part faster, energy per part can be competitive, provided there is enough work to keep it busy.",
    },
    {
      q: "Can the same fiber laser be used for welding?",
      a: "Yes. The laser source can be fitted for welding instead of cutting, depending on the application. Laser welding gives a narrow, low-distortion weld at high travel speed, which suits thin sheet, stainless steel and joints where appearance matters. The power needed for welding is often different from the power needed for cutting, so tell us the parts and joints you have in mind when discussing the configuration.",
    },
    {
      q: "Can I upgrade the laser power on a machine later?",
      a: "Sometimes, but it is rarely as simple as swapping the source. More power usually needs a larger chiller, a cutting head and optics rated for it, a bigger electrical supply and sometimes a stronger gas system. Depending on how the machine was built, the upgrade can cost a large share of a new machine. It is usually better to choose the right power at the start.",
    },
  ],
  families: ["fiber-laser-cutting-machines"],
  related: ["laser-vs-plasma-cutting", "preparing-factory-for-cnc-machine", "cnc-machine-buying-checklist"],
  published: "2026-10-07",
  updated: "2026-10-07",
};
