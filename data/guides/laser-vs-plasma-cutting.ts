import type { Guide } from "../types";

export const guide: Guide = {
  slug: "laser-vs-plasma-cutting",
  title: "Laser vs Plasma Cutting: Which CNC Cutter Do You Need?",
  description:
    "Laser vs plasma cutting compared on edge quality, materials, thickness and running cost, with a simple decision guide for choosing a CNC cutting machine.",
  h1: "Laser vs Plasma Cutting: Which CNC Cutting Machine Do You Need?",
  summary:
    "Choose a CNC fiber laser if your parts need fine detail, small holes, square edges or a clean finish on sheet and medium plate. Choose CNC plasma if you mostly cut mild steel plate for structural or heavy fabrication, where low purchase and running cost matter more than edge finish. Many workshops start with plasma and add a laser as precision work grows.",
  sections: [
    {
      h2: "How do laser and plasma cutting work?",
      paragraphs: [
        "Both are thermal cutting processes driven by a CNC gantry that follows a programmed path, and both melt the metal along a narrow line and blow the molten material out of the cut. The difference is the heat source.",
        "A fiber laser focuses a beam of light, generated in a diode-pumped optical fibre, onto a very small spot. An assist gas, usually oxygen, nitrogen or clean compressed air, clears the melt from the kerf. Because the spot is so small, the energy is concentrated and the cut is narrow.",
        "A plasma torch passes an electric arc through a gas, usually compressed air, squeezed through a fine nozzle. The arc turns the gas into plasma hot enough to melt steel, and the gas stream pushes the molten metal out. The workpiece is part of the electrical circuit, which is why plasma only cuts conductive metals. The arc is wider than a laser spot, so the kerf is wider and more heat goes into the plate.",
      ],
    },
    {
      h2: "How do edge quality, accuracy and detail compare?",
      paragraphs: [
        "This is where the two processes differ most. A fiber laser leaves a narrow kerf, an edge that is close to square, and a small heat-affected zone. Small holes, slots, tabs and fine lettering come out cleanly, and parts usually go straight to bending, welding or painting without grinding.",
        "Plasma leaves a wider kerf and a slight bevel on the edge, and the heat-affected zone is larger. Holes that are small relative to the plate thickness tend to come out tapered or out of round, so many fabricators drill critical holes after plasma cutting. With the right current, speed, torch height and fresh consumables, dross is light and easy to remove, and for parts that will be welded, machined or hidden in a structure, plasma edge quality is usually perfectly acceptable.",
        "If your drawings call for close-fitting tabs and slots, precise hole positions or visible edges on stainless steel, the laser earns its higher price. If they call for base plates, gussets and brackets, it often does not.",
      ],
    },
    {
      h2: "Which materials and thicknesses suit each process?",
      paragraphs: [
        "A fiber laser is at its best on thin sheet and medium plate, where it is both faster and cleaner than plasma. It cuts carbon steel, stainless steel and aluminium well, and with a correctly specified source and cutting head it can also cut reflective metals such as brass and copper. Higher laser power extends the thickness it can cut productively, but the cost of the machine rises with it.",
        "Plasma cuts any conductive metal, including mild steel, stainless steel, aluminium, galvanised sheet, brass and copper. It is strongest on mild steel plate in the medium-to-thick range, where it cuts quickly at a fraction of the capital cost of a high-power laser. On very thin sheet, plasma can distort the part and leaves a coarser edge than a laser.",
        "Neither process cuts wood, plastics or glass in an industrial metal-cutting setup; those need different machines.",
      ],
    },
    {
      h2: "How do buying and running costs compare?",
      paragraphs: [
        "A CNC plasma machine costs considerably less to buy than a fiber laser, and its installation is simpler. The fiber laser needs a water chiller, a higher-rated electrical connection as power increases, and an assist-gas supply that can be a significant running cost when cutting stainless steel or aluminium with nitrogen.",
        "Plasma running costs are electricity, compressed air and consumables. The electrode and nozzle wear with every pierce and must be changed regularly; a job with many small parts and many pierces uses them faster. Laser consumables, mainly nozzles and protective windows, last longer, and the fiber source itself needs little routine maintenance.",
        "The fairer comparison is cost per finished part, not cost per hour. A laser part that needs no grinding, drilling or rework can be cheaper overall than a plasma part that does, even though the laser costs more to run. Equally, a laser bought for plate work that plasma would cut acceptably ties up capital for little gain.",
      ],
    },
    {
      h2: "Laser or plasma: a quick decision guide",
      paragraphs: [
        "Start with the parts you cut most often, not the occasional special job. Then work through these points honestly:",
      ],
      bullets: [
        "Choose a fiber laser if most of your work is thin or medium sheet, especially stainless steel or aluminium.",
        "Choose a fiber laser if parts need small holes, tight tab-and-slot fits, sharp corners or visible, finish-ready edges.",
        "Choose plasma if most of your work is mild steel plate for structural, agricultural or heavy fabrication.",
        "Choose plasma if the parts will be welded, machined or painted anyway and a slight edge bevel does not matter.",
        "Choose plasma if budget is tight and you need to start cutting in-house quickly.",
        "Consider both if you cut a broad mix: plasma for heavy plate, laser for precision sheet.",
      ],
    },
    {
      h2: "What about safety, fume and floor space?",
      paragraphs: [
        "Both processes produce fume and need proper extraction. Plasma produces more fume, dust, noise and ultraviolet light, so it is normally run over a water table or a downdraught table with extraction, and operators need suitable eye protection. Fiber laser light is invisible and can damage eyes at a distance, so the cutting area must be enclosed or guarded to the applicable laser safety standards, which modern fully enclosed machines provide.",
        "Plan the floor space around the whole installation, not just the cutting bed. A laser needs room for its chiller, gas supply and electrical cabinet; plasma needs room for its power source, air compressor and dryer. Both need space to load full sheets and unload cut parts.",
      ],
    },
    {
      h2: "How RA Machine helps you choose",
      paragraphs: [
        "RA Machine builds both: CNC fiber laser cutting machines from 1.5 kW to 30 kW and CNC plasma cutting machines from 100 A to 200 A with a 2 mm to 25 mm cutting range. Because we make both, we have no reason to push one over the other. Send us sample drawings, your materials and your monthly volume, and we will recommend the process and configuration that suits the work.",
        "Every machine is configured to the job and supplied with installation, commissioning and operator training. Afterwards we offer remote diagnostics within 4 working hours, stocked spares, and on-site service the next working day around Kolkata or within 48 hours elsewhere in India.",
      ],
    },
  ],
  faqs: [
    {
      q: "Do laser-cut parts need finishing before welding or painting?",
      a: "Usually very little. Stainless steel and aluminium cut with nitrogen have a bright, oxide-free edge that can go straight to welding or powder coating. Carbon steel cut with oxygen leaves a thin oxide layer on the edge, which some painting and coating processes require removing for best adhesion. Plasma-cut edges more often need light deburring or dross removal, and critical holes may need drilling.",
    },
    {
      q: "Can I start with plasma and add a laser later?",
      a: "Yes, and many fabricators grow exactly this way. A plasma machine brings plate cutting in-house at modest cost and keeps doing that work well after a laser arrives. When enough precision sheet work builds up to justify a laser, it takes over those parts. The nesting and programming skills your team learns on plasma carry over, so the second machine is quicker to get productive.",
    },
    {
      q: "Is oxy-fuel or waterjet cutting worth considering instead?",
      a: "They solve different problems. Oxy-fuel cuts very thick carbon steel cheaply but is slow and only works on steel that oxidises, not stainless steel or aluminium. Waterjet cuts almost any material without heat, which suits heat-sensitive parts and non-metals, but it is slow and abrasive costs are high. For everyday sheet and plate work in steel and aluminium, laser and plasma cover most needs.",
    },
    {
      q: "Which machine is easier for operators to learn?",
      a: "Both are programmed in a similar way: parts are drawn in CAD, nested on a sheet, and the CNC runs the cut. Plasma operators must also learn to judge consumable wear and torch height, because both affect edge quality directly. Laser operators need to understand focus position, assist-gas settings and lens and window care. With proper training, operators become productive on either machine fairly quickly.",
    },
    {
      q: "Can a fiber laser cut thicker plate than plasma?",
      a: "It depends on the laser power. Higher-power fiber lasers cut thick plate well, but the capital cost rises steeply with power. For thick mild steel plate where edge finish is not critical, plasma usually cuts it at a much lower machine cost. The practical question is not which can cut thicker, but which cuts your regular thicknesses at the quality you need for the lowest total cost.",
    },
  ],
  families: ["fiber-laser-cutting-machines", "cnc-plasma-cutting-machines"],
  related: ["fiber-laser-power-guide", "cnc-plasma-cutter-guide", "cnc-machine-buying-checklist"],
  published: "2026-10-07",
  updated: "2026-10-07",
};
