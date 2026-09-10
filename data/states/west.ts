/**
 * West India state data for the "laser cutting machines in <state>"
 * and "robotic welding in <state>" landing pages.
 *
 * To edit a state: update the matching object below directly.
 * To add a new state: see the `State` interface in data/types.ts for the
 * required shape, and data/india-index.ts for the canonical list of state/UT
 * slugs (use only those slugs in neighbouringStateSlugs). Keep facts real —
 * clusters, industrial estates and ports must be genuine, named places.
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const westStates: State[] = [
  {
    slug: "maharashtra",
    name: "Maharashtra",
    type: "state",
    tier: "large",
    region: "West",
    capital: "Mumbai",
    overview: [
      "Maharashtra is India's largest state economy and its industrial base runs from the Mumbai-Pune corridor through Nashik to Aurangabad (Chhatrapati Sambhajinagar) and Nagpur in the east. Pune and Chakan anchor one of the country's densest automotive and auto-component clusters, feeding assembly lines that in turn depend on precision sheet metal and welded sub-assemblies produced by hundreds of tier-2 and tier-3 fabricators.",
      "Kolhapur and Ahmednagar carry a long-established foundry and casting tradition, while Nashik and Thane host electrical and electronics manufacturing. JNPT near Mumbai is India's busiest container port, giving the state's exporters direct sea access. This mix of automotive volume, foundry pattern work, and export-grade fabrication creates steady demand for fiber laser cutting and robotic MIG welding across the state.",
    ],
    industries: [
      {
        name: "Automotive & auto components",
        clusters: ["Pune", "Chakan", "Chhatrapati Sambhajinagar"],
        products: ["chassis brackets", "body panels", "transmission housings", "sheet metal sub-assemblies"],
        note: "High-mix, high-volume component supply around Pune and Chakan rewards the repeatability of fiber laser cutting paired with robotic welding cells for consistent weld quality across shifts.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Engineering & machine tools",
        clusters: ["Pune", "Nashik"],
        products: ["machine frames", "enclosures", "structural components"],
        note: "Machine tool builders in Pune and Nashik need tight-tolerance cutting for enclosures and structural steel, where a 3 kW fiber laser covers most job thicknesses economically.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Foundries & castings",
        clusters: ["Kolhapur", "Ahmednagar"],
        products: ["cast components", "fixtures", "gating and pattern plates"],
        note: "Foundry ancillary fabrication around Kolhapur increasingly pairs cast parts with laser-cut steel fixtures and brackets, shortening pattern and tooling lead times.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Electrical & electronics",
        clusters: ["Nashik", "Thane"],
        products: ["enclosures", "panel boards", "control cabinets"],
        note: "Electrical panel and enclosure makers near Nashik and Thane rely on clean, burr-free thin-sheet cutting for consistent panel assembly and finish quality.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Textile machinery",
        clusters: ["Solapur", "Ichalkaranji"],
        products: ["loom parts", "machine frames", "spare components"],
        note: "Textile machinery workshops in Solapur and Ichalkaranji fabricate replacement frames and parts where in-house laser cutting cuts dependency on outsourced blanking.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Chemicals & pharma equipment",
        clusters: ["Thane-Belapur", "Tarapur"],
        products: ["stainless process skids", "tanks", "structural supports"],
        note: "Process equipment fabricators along the Thane-Belapur belt need precise stainless and mild steel cutting for skids and structural supports feeding pharma and chemical plants.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd"],
      },
    ],
    industrialAreas: [
      "MIDC Chakan",
      "MIDC Pimpri-Chinchwad",
      "MIDC Ranjangaon",
      "MIDC Waluj (Aurangabad)",
      "MIDC Ambad (Nashik)",
      "Taloja MIDC",
      "Shiroli/Gokul Shirgaon MIDC (Kolhapur)",
      "Butibori MIDC (Nagpur)",
    ],
    logisticsNote:
      "Machines and spares move from Kolkata to Maharashtra by road via NH16 and NH48 through the Nagpur-Mumbai corridor, typically 4-6 days depending on the destination cluster, with heavier consignments also available via coastal shipping between Kolkata/Haldia and Mumbai Port or JNPT. Air freight through Kolkata and Mumbai/Pune airports covers urgent spares within 1-2 days.",
    neighbouringStateSlugs: [
      "gujarat",
      "madhya-pradesh",
      "chhattisgarh",
      "telangana",
      "karnataka",
      "goa",
      "dadra-and-nagar-haveli-and-daman-and-diu",
    ],
    faqs: [
      {
        q: "How do I get a quote for a laser cutting or welding machine for my Maharashtra unit?",
        a: "Share your material type, thickness range, sheet size and typical monthly volume with RA Machine, and our team will recommend a model and send a formal quotation covering machine price, freight to your Maharashtra location, and installation. Buyers in clusters like Chakan, Pune and Aurangabad can also request a video walkthrough of the machine before committing.",
      },
      {
        q: "What is the typical delivery and installation timeline to Maharashtra from Kolkata?",
        a: "Standard fiber laser models are usually delivered to Pune, Mumbai, Nashik or Aurangabad within 2-3 weeks of order confirmation, including road transit of 4-6 days. RA Machine engineers travel from Kolkata to commission the machine on-site, run calibration cuts, and hand over the system typically within a day or two of arrival.",
      },
      {
        q: "Does RA Machine provide on-site service and AMC coverage in Maharashtra?",
        a: "Yes. Service engineers are dispatched from RA Machine's Kolkata headquarters for on-site visits across Maharashtra, backed by remote diagnostics for faster first-response troubleshooting. Annual maintenance contracts cover scheduled preventive maintenance, laser source and consumable checks, and priority scheduling for breakdown calls from clusters such as Chakan and Kolhapur.",
      },
      {
        q: "Can operators from our Maharashtra plant get trained on the machine?",
        a: "Training is provided on-site at your Maharashtra facility during commissioning, covering machine operation, nesting software and routine maintenance. Operators can also attend a more in-depth hands-on training programme at RA Machine's training centre in Kolkata, which is useful for teams that want deeper exposure before scaling up production.",
      },
      {
        q: "Which RA Machine model suits Maharashtra's automotive component industry best?",
        a: "For the automotive and auto-component fabricators concentrated around Pune and Chakan, the RA-F3015-Pro 3 kW fiber laser is the workhorse choice for general sheet metal cutting, often paired with the RA-RW6 robotic welding cell for chassis brackets and welded sub-assemblies that need consistent weld quality across high production volumes.",
      },
      {
        q: "Can Maharashtra-based exporters route GST invoicing and shipment through JNPT or Mumbai Port?",
        a: "Yes. RA Machine issues GST-compliant tax invoices for domestic buyers in Maharashtra and can coordinate export documentation for units shipping finished goods onward through JNPT or Mumbai Port. Interstate buyers benefit from straightforward e-way bill processing given the established road and rail freight links between Kolkata and Maharashtra's industrial belt.",
      },
    ],
  },
  {
    slug: "gujarat",
    name: "Gujarat",
    type: "state",
    tier: "large",
    region: "West",
    capital: "Gandhinagar",
    overview: [
      "Gujarat is India's most export-oriented industrial state, anchored by three major ports at Mundra, Kandla and Pipavav that together handle a large share of the country's containerised and bulk cargo. Rajkot is known for diesel engines and general engineering, Morbi has grown into the world's second-largest ceramics manufacturing hub, and Jamnagar carries a long brass and metal parts tradition alongside its refinery complex.",
      "Vadodara and Dahej host petrochemical and refinery equipment fabrication at scale, while Surat and Ahmedabad supply textile machinery and Sanand and Halol serve the auto component sector. This breadth of heavy engineering, process equipment and precision component work sustains consistent demand for both thick-plate and thin-sheet laser cutting capacity across the state.",
    ],
    industries: [
      {
        name: "Engineering & diesel engines",
        clusters: ["Rajkot"],
        products: ["engine blocks", "machine parts", "pump components"],
        note: "Rajkot's dense engineering and diesel engine manufacturing base needs reliable mid-power fiber laser cutting for machine parts and enclosures produced at scale.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Ceramics machinery",
        clusters: ["Morbi"],
        products: ["kiln structures", "conveyor frames", "machine housings"],
        note: "Morbi's ceramics manufacturing scale drives demand for structural steel fabrication for kiln and conveyor systems, where heavier plate cutting and robotic welding speed up frame production.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw6"],
      },
      {
        name: "Brass & metal parts",
        clusters: ["Jamnagar"],
        products: ["brass fittings", "sheet metal components", "tooling"],
        note: "Jamnagar's brass parts industry uses thin and mid-thickness sheet cutting for tooling, jigs and ancillary sheet metal components that support the core metal parts trade.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Petrochemicals & refinery equipment",
        clusters: ["Vadodara", "Dahej", "Jamnagar"],
        products: ["process skids", "structural steel", "pressure vessel parts"],
        note: "Heavy fabrication for refinery and petrochemical equipment around Vadodara and Dahej requires thick-plate cutting and robotic welding to meet structural and pressure-part quality standards.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k", "ra-rw10"],
      },
      {
        name: "Textile machinery",
        clusters: ["Surat", "Ahmedabad"],
        products: ["loom frames", "machine parts", "spares"],
        note: "Textile machinery fabricators in Surat and Ahmedabad benefit from in-house cutting of frames and spares to shorten turnaround on machine builds and repairs.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Auto components",
        clusters: ["Sanand", "Halol"],
        products: ["body panels", "brackets", "welded assemblies"],
        note: "Auto component plants at Sanand and Halol pair precision sheet cutting with robotic welding cells to keep pace with OEM production schedules and consistent weld quality.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
    ],
    industrialAreas: [
      "Aji/Metoda GIDC (Rajkot)",
      "Morbi Ceramic Zone",
      "Dared GIDC (Jamnagar)",
      "Vatva/Naroda GIDC (Ahmedabad)",
      "Sanand GIDC",
      "Dahej PCPIR",
    ],
    logisticsNote:
      "Road freight from Kolkata to Gujarat's industrial belt runs primarily via NH19 and NH48 through central India, with typical transit of 5-7 days to Ahmedabad, Rajkot or Morbi. Heavier machines and plate-handling equipment can also move by coastal shipping between Kolkata/Haldia and Mundra or Kandla, and air freight for spares connects via Kolkata and Ahmedabad within 1-2 days.",
    neighbouringStateSlugs: ["rajasthan", "madhya-pradesh", "maharashtra", "dadra-and-nagar-haveli-and-daman-and-diu"],
    faqs: [
      {
        q: "How do I request a quote for a machine for our Gujarat facility?",
        a: "Send RA Machine your material specifications, thickness range and expected production volume, and we will recommend a suitable model and provide a quotation that includes machine cost, freight to your Gujarat location, and installation charges. Buyers in Rajkot, Morbi or Vadodara can request reference cut samples before finalising the order.",
      },
      {
        q: "What is the delivery and installation timeline from Kolkata to Gujarat?",
        a: "Machines typically reach Ahmedabad, Rajkot, Morbi or Vadodara within 3-4 weeks of order confirmation, factoring in a road transit window of 5-7 days. RA Machine engineers travel from Kolkata to carry out on-site installation, calibration and test cuts, generally completing commissioning within one to two days of the machine's arrival.",
      },
      {
        q: "Is on-site service and AMC support available in Gujarat?",
        a: "Yes. RA Machine dispatches service engineers from its Kolkata headquarters for on-site visits across Gujarat's industrial belt, supported by remote diagnostics to resolve many issues without a site visit. AMC plans cover scheduled preventive maintenance and priority breakdown response for clusters including Rajkot, Morbi and Vadodara.",
      },
      {
        q: "Can our operators in Gujarat be trained on the new machine?",
        a: "Yes, operator training is conducted on-site at your Gujarat plant as part of commissioning, covering safe operation, cutting parameters and nesting software. For deeper hands-on exposure, operators can also attend an extended training programme at RA Machine's training centre in Kolkata before the machine goes into full production.",
      },
      {
        q: "Which RA Machine model fits Gujarat's ceramics and heavy engineering industry?",
        a: "For Morbi's ceramics machinery fabricators building kiln and conveyor structures, the RA-F6020-HD 6 kW fiber laser handles heavier plate efficiently, and pairing it with the RA-RW6 robotic welding cell speeds up frame assembly. Refinery equipment fabricators around Vadodara and Dahej often step up to the RA-F12K for extreme thick-plate work.",
      },
      {
        q: "Can Gujarat exporters route shipments and GST invoicing through Mundra or Kandla?",
        a: "Yes. RA Machine issues GST-compliant invoices for Gujarat buyers, and exporters shipping finished fabricated goods onward through Mundra, Kandla or Pipavav can coordinate documentation accordingly. The state's strong port connectivity makes it straightforward for Gujarat-based fabricators to combine domestic laser cutting capacity with export-oriented production.",
      },
    ],
  },
  {
    slug: "goa",
    name: "Goa",
    type: "state",
    tier: "medium",
    region: "West",
    capital: "Panaji",
    overview: [
      "Goa's manufacturing base is smaller and more specialised than its larger neighbours, concentrated around Verna, Kundaim and Cuncolim industrial estates near Mormugao Port. Pharmaceutical formulation and equipment fabrication is a leading segment, alongside electronics and light engineering units that supply components regionally and for export.",
      "Vasco da Gama's proximity to the port supports shipbuilding ancillary work and fabrication tied to mining equipment servicing, a legacy of Goa's iron ore trade. This combination of pharma equipment, light engineering and marine-adjacent fabrication keeps demand steady for compact, precise sheet metal cutting rather than heavy-plate capacity.",
    ],
    industries: [
      {
        name: "Pharmaceuticals & equipment",
        clusters: ["Verna"],
        products: ["stainless process equipment", "enclosures", "skid frames"],
        note: "Pharma equipment fabricators in Verna need clean, precise stainless steel cutting for process equipment enclosures and skid frames built to tight tolerances.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Electronics & light engineering",
        clusters: ["Verna", "Kundaim"],
        products: ["enclosures", "panels", "brackets"],
        note: "Light engineering and electronics units around Verna and Kundaim rely on thin-sheet laser cutting for enclosures and panels where finish quality and edge precision matter.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Shipbuilding ancillaries",
        clusters: ["Vasco da Gama"],
        products: ["deck fittings", "structural brackets", "welded assemblies"],
        note: "Shipbuilding ancillary fabricators near Vasco da Gama use robotic welding for consistent quality on structural brackets and deck fittings supplied to marine contractors.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Mining equipment fabrication",
        clusters: ["Verna", "Cuncolim"],
        products: ["equipment frames", "wear plates", "repair fabrication"],
        note: "Mining equipment servicing and fabrication in Goa's industrial estates needs mid-thickness plate cutting for frames and wear components used in repair and overhaul work.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
    ],
    industrialAreas: ["Verna Industrial Estate", "Kundaim Industrial Estate", "Cuncolim Industrial Estate"],
    logisticsNote:
      "Machines move from Kolkata to Goa by road via NH16 down the eastern and southern coast, with typical transit of 6-8 days to Verna or Kundaim. For larger equipment, coastal shipping between Kolkata/Haldia and Mormugao Port is a practical alternative, and air freight for spares connects through Kolkata and Goa's airport within 1-2 days.",
    neighbouringStateSlugs: ["maharashtra", "karnataka"],
    faqs: [
      {
        q: "How do I get a quotation for a laser cutting machine for our Goa unit?",
        a: "Share your material type, thickness and typical batch sizes with RA Machine, and we will propose a suitable model with a quotation covering machine cost, freight to Verna or Kundaim, and installation. Given Goa's compact industrial base, we can also advise on the most versatile model for mixed pharma and light engineering work.",
      },
      {
        q: "What is the delivery timeline from Kolkata to Goa?",
        a: "Standard machines typically reach Verna or Kundaim within 3-4 weeks of order confirmation, including a road transit window of 6-8 days, or via coastal shipping to Mormugao Port for larger equipment. RA Machine engineers travel from Kolkata to complete on-site installation and calibration, usually within a day or two of arrival.",
      },
      {
        q: "Is on-site service and AMC coverage available for Goa customers?",
        a: "Yes. RA Machine engineers are dispatched from the Kolkata headquarters for on-site service visits to Goa's industrial estates, supplemented by remote diagnostics for quicker issue resolution. AMC plans cover scheduled preventive maintenance and prioritised response for breakdowns, relevant to Verna's pharma equipment and light engineering fabricators.",
      },
      {
        q: "Can operators from our Goa facility be trained on the machine?",
        a: "Training is provided on-site at your Goa facility during commissioning, covering operation, cutting parameters and basic maintenance. Operators are also welcome to attend a more thorough hands-on training session at RA Machine's training centre in Kolkata, particularly useful for teams handling precision pharma equipment fabrication.",
      },
      {
        q: "Which RA Machine model suits Goa's pharma equipment industry?",
        a: "For pharma equipment and stainless process fabrication concentrated around Verna, the RA-F3015-Pro 3 kW fiber laser handles the material range and precision most Goa fabricators need, while the compact RA-F1530 suits smaller electronics and light engineering units producing thinner-gauge enclosures and panels.",
      },
      {
        q: "Can GST-compliant billing be arranged for Goa customers, and is export via Mormugao possible?",
        a: "Yes. RA Machine issues GST-compliant invoices for Goa-based buyers, and units that export fabricated goods through Mormugao Port can coordinate shipping documentation as needed. Interstate logistics between Kolkata and Goa are well established via the eastern coastal road corridor, keeping both domestic delivery and onward export straightforward.",
      },
    ],
  },
  {
    slug: "dadra-and-nagar-haveli-and-daman-and-diu",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    type: "ut",
    tier: "small",
    region: "West",
    capital: "Daman",
    overview: [
      "Dadra and Nagar Haveli and Daman and Diu is a compact union territory whose industrial activity is concentrated in Silvassa and Daman, benefiting from proximity to both the Mumbai and Gujarat industrial belts and preferential tax status that has historically drawn small and mid-size manufacturing units. Plastics and packaging, textiles and food processing form the core of the local economy.",
      "Silvassa's Piparia and Masat estates host a dense cluster of small engineering and ancillary units that supply components to nearby Gujarat and Maharashtra industries, while Daman's Kachigam estate carries similar light manufacturing activity. This proximity-driven ancillary manufacturing model creates demand for compact, easy-to-operate sheet metal cutting equipment.",
    ],
    industries: [
      {
        name: "Plastics & packaging",
        clusters: ["Silvassa"],
        products: ["machine parts", "moulds", "packaging line components"],
        note: "Plastics and packaging machinery units in Silvassa need precise sheet metal parts for machine frames and mould components, favouring compact fiber laser systems suited to smaller shop floors.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Small engineering units",
        clusters: ["Silvassa"],
        products: ["brackets", "enclosures", "ancillary components"],
        note: "Small engineering ancillary units around Silvassa supply components to larger Gujarat and Maharashtra manufacturers, where in-house laser cutting reduces dependence on outsourced blanking and shortens delivery cycles.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Textiles",
        clusters: ["Silvassa"],
        products: ["machine frames", "spare parts"],
        note: "Textile units in Silvassa occasionally fabricate machine frames and spares locally, where a compact fiber laser or CO2 machine covers both metal and non-metal cutting needs.",
        recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
      },
      {
        name: "Food processing",
        clusters: ["Daman"],
        products: ["equipment frames", "stainless fittings", "conveyor parts"],
        note: "Food processing equipment fabrication around Daman requires clean-cut stainless and mild steel parts for conveyor frames and equipment fittings, well suited to a compact fiber laser.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
    ],
    industrialAreas: ["Piparia Industrial Estate (Silvassa)", "Masat Industrial Estate (Silvassa)", "Kachigam Industrial Estate (Daman)"],
    logisticsNote:
      "Road freight from Kolkata to Silvassa or Daman runs via NH19 and NH48 through the same corridor serving Gujarat and Maharashtra, with typical transit of 5-6 days. Air freight for urgent spares connects through Kolkata to Mumbai or Surat airport, with onward road transfer completing delivery within a day.",
    neighbouringStateSlugs: ["gujarat", "maharashtra"],
    faqs: [
      {
        q: "How can a Silvassa or Daman unit get a quotation from RA Machine?",
        a: "Share your material specifications, thickness range and expected job sizes with RA Machine, and we will recommend a suitable compact model and provide a quotation covering machine price, freight to Silvassa or Daman, and installation. Many buyers in this union territory operate smaller shop floors, so we help size the machine to available space.",
      },
      {
        q: "What is the delivery and installation timeline to Silvassa or Daman from Kolkata?",
        a: "Machines typically arrive at Silvassa or Daman within 2-3 weeks of order confirmation, with road transit generally taking 5-6 days along the NH19/NH48 corridor. RA Machine engineers travel from Kolkata to install and calibrate the machine on-site, usually completing commissioning within a day of arrival.",
      },
      {
        q: "Is on-site service and AMC support available here?",
        a: "Yes. RA Machine dispatches engineers from its Kolkata headquarters for on-site visits to Silvassa and Daman, combined with remote diagnostics to resolve many faults without a site call. AMC coverage includes scheduled preventive maintenance and priority response for breakdowns affecting the small engineering and packaging units common in this territory.",
      },
      {
        q: "Can our operators be trained on-site or in Kolkata?",
        a: "Operator training is provided on-site during machine commissioning at your Silvassa or Daman facility, covering safe operation and routine upkeep. For more detailed hands-on training, operators can also visit RA Machine's training centre in Kolkata, which suits smaller teams wanting a deeper introduction before scaling production.",
      },
      {
        q: "Which RA Machine model suits the plastics and packaging machinery units in Silvassa?",
        a: "For plastics and packaging machinery fabricators in Silvassa working with thinner gauge sheet and moderate volumes, the compact RA-F1530 1.5 kW fiber laser is typically the most cost-effective fit, with an upgrade path to the RA-F3015-Pro as production volumes and material thickness requirements grow.",
      },
      {
        q: "How does interstate GST and logistics work for buyers in this union territory?",
        a: "RA Machine issues GST-compliant invoices for buyers in Dadra and Nagar Haveli and Daman and Diu, and interstate e-way bill processing is straightforward given the territory's direct road connectivity with Gujarat and Maharashtra. Units exporting through nearby Gujarat ports can also coordinate onward shipping documentation as required.",
      },
    ],
  },
];
