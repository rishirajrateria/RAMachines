/**
 * data/states/south-2.ts — state/UT data for Kerala, Puducherry,
 * Andaman and Nicobar Islands, and Lakshadweep.
 * See data/types.ts for the State/StateIndustry/FaqItem interfaces and
 * data/india-index.ts for the canonical list of state/UT slugs. To add a
 * new state entry, follow the shape of an existing entry below and append
 * it to the exported array — do not create a second export from this file.
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const south2States: State[] = [
  {
    slug: "kerala",
    name: "Kerala",
    type: "state",
    tier: "large",
    region: "South",
    capital: "Thiruvananthapuram",
    overview: [
      "Kerala's manufacturing base is smaller and more specialised than its neighbours, built around the Kochi-Ernakulam industrial belt, the Palakkad gap that channels road and rail traffic into Tamil Nadu, and a long coastline anchored by Cochin Port and the deep-water Vizhinjam International Seaport. Cochin Shipyard and its ancillary fabricators drive demand for structural steel work, while Kalamassery and Athani host general engineering and electrical equipment units.",
      "High remittance-linked consumption and steady public infrastructure spending support fabrication for construction, marine equipment, and food-processing machinery, alongside long-standing coir and Ayurveda-linked manufacturing in Alappuzha and the Palakkad electrical cluster. Skilled labour is available, but sheet metal capacity is limited compared to Tamil Nadu or Karnataka, creating clear demand for local, precision cutting and welding capability.",
    ],
    industries: [
      {
        name: "Engineering & fabrication",
        clusters: ["Kochi", "Ernakulam"],
        products: ["structural steel", "machine frames", "process equipment"],
        note: "General engineering workshops around Kochi need consistent, accurate sheet cutting to keep fabrication schedules tied to marine and infrastructure projects on track.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Shipbuilding & marine ancillaries",
        clusters: ["Kochi", "Cochin Shipyard belt"],
        products: ["ship hull sections", "deck fittings", "marine brackets"],
        note: "Ancillary units feeding the Cochin Shipyard belt cut and weld thick steel plate for hull and structural work, where clean edges and repeatable robotic welds reduce rework on marine-grade steel.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw6"],
      },
      {
        name: "Electrical equipment",
        clusters: ["Palakkad"],
        products: ["switchgear enclosures", "transformer parts", "control panels"],
        note: "Palakkad's electrical manufacturers rely on precise thin-to-medium sheet cutting for enclosures and panel components, where dimensional accuracy affects downstream assembly speed.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Coir machinery",
        clusters: ["Alappuzha"],
        products: ["coir processing equipment", "spinning machine parts"],
        note: "Coir machinery fabricators in Alappuzha need affordable, dependable sheet cutting for machine parts produced in smaller batch sizes.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Food processing & Ayurveda equipment",
        clusters: ["Kochi", "Thrissur"],
        products: ["stainless steel tanks", "conveyor frames", "processing line components"],
        note: "Stainless steel fabrication for food and Ayurveda processing equipment benefits from clean, burr-free laser-cut edges that reduce finishing time on hygienic surfaces.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
    ],
    industrialAreas: [
      "Kalamassery Industrial Estate",
      "Kinfra Small Industries Park",
      "Kanjikode Industrial Area",
      "Athani Industrial Area",
    ],
    logisticsNote:
      "Machines move from Kolkata by road along NH16 and NH544 through Bhubaneswar and Chennai to Kochi and Palakkad, typically 6-9 days depending on the destination cluster, with rail freight an option for heavier consignments. Coastal shipping between Kolkata/Haldia and Cochin Port is available for oversized loads, and air freight from Kolkata covers spares and engineer dispatch on shorter notice.",
    neighbouringStateSlugs: ["tamil-nadu", "karnataka", "puducherry"],
    faqs: [
      {
        q: "How do I get a quote for a laser cutting or welding machine in Kerala?",
        a: "Share your material type, thickness range, typical sheet or tube size, and monthly production volume with RA Machine, and our team will recommend a suitable model and send a formal quotation covering machine price, freight from Kolkata to your Kerala facility, and installation. Site photos or a floor plan help finalise power and layout requirements before dispatch.",
      },
      {
        q: "What is the typical delivery and installation timeline from Kolkata to Kerala?",
        a: "After order confirmation, standard fiber laser models are typically dispatched within 3-5 weeks, with road transit to Kochi or Palakkad adding roughly 6-9 days. RA Machine engineers travel from Kolkata to carry out on-site installation, mechanical alignment, and commissioning, which usually takes 3-5 working days depending on the machine and site readiness.",
      },
      {
        q: "Does RA Machine provide on-site service and AMC support in Kerala?",
        a: "Yes. RA Machine offers annual maintenance contracts covering scheduled servicing, calibration, and priority breakdown support. Engineers are dispatched from our Kolkata headquarters for on-site visits, backed by remote diagnostics for faster first-response troubleshooting, so customers in Kochi, Palakkad, and Alappuzha are not left waiting on unresolved issues.",
      },
      {
        q: "Is operator training available for customers in Kerala?",
        a: "Training is provided on-site at your facility during installation, covering machine operation, nesting software, and routine maintenance. Customers who prefer a more structured session can also send operators to RA Machine's training centre in Kolkata, which combines classroom instruction with hands-on practice on live machines before they return to run production.",
      },
      {
        q: "Which RA Machine model suits Kerala's shipbuilding and marine fabrication industry?",
        a: "For the Cochin Shipyard ancillary belt, the RA-F6020-HD heavy plate fiber laser handles thick steel plate cutting for hull and structural sections, while the RA-RW6 robotic welding cell improves weld consistency on repetitive marine brackets and fittings, together reducing manual rework common in marine-grade steel fabrication.",
      },
      {
        q: "Can Kerala customers get GST invoicing or export documentation through Cochin Port?",
        a: "Yes. RA Machine issues GST-compliant invoices for domestic buyers in Kerala, and for exporters routing finished goods through Cochin Port or Vizhinjam International Seaport, we can provide standard commercial documentation to support customs and shipping requirements. Financing is arranged through your preferred bank or NBFC, as RA Machine does not offer in-house financing.",
      },
    ],
  },
  {
    slug: "puducherry",
    name: "Puducherry",
    type: "ut",
    tier: "small",
    region: "South",
    capital: "Puducherry",
    overview: [
      "Puducherry's industrial economy is compact but tightly integrated with the Chennai-Tamil Nadu manufacturing corridor, feeding automotive and electronics supply chains that sit just across the border. Units in Sedarapet, Thattanchavady, and Mettupalayam produce auto components, electronics assembly parts, and pharmaceutical equipment, benefiting from tax incentives and proximity to Chennai's ports and OEM plants.",
      "Because Puducherry functions largely as a satellite manufacturing base for larger Tamil Nadu supply chains, fabricators need cutting and welding equipment that matches the tight tolerances and volume demands of automotive and electronics customers, even though the territory itself is geographically small and industrially concentrated in a handful of estates.",
    ],
    industries: [
      {
        name: "Auto components",
        clusters: ["Sedarapet", "Thattanchavady"],
        products: ["brackets", "chassis parts", "sheet metal assemblies"],
        note: "Auto component units supplying Chennai OEMs need repeatable, tight-tolerance sheet cutting to meet automotive quality standards on brackets and structural parts.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Electronics assembly",
        clusters: ["Mettupalayam", "Puducherry"],
        products: ["enclosures", "chassis panels", "mounting frames"],
        note: "Electronics assembly units require precise thin-sheet cutting for enclosures and panels, where consistent dimensions reduce fitment issues during assembly.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Pharmaceutical equipment",
        clusters: ["Puducherry"],
        products: ["stainless steel frames", "equipment housings"],
        note: "Pharma equipment fabricators need clean-cut stainless steel components, where laser cutting reduces contamination risk from burrs and secondary finishing.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
    ],
    industrialAreas: [
      "Sedarapet Industrial Estate",
      "Thattanchavady Industrial Estate",
      "Mettupalayam Industrial Estate",
    ],
    logisticsNote:
      "Machines travel from Kolkata via NH16 through Bhubaneswar and Chennai to Puducherry, a road transit of roughly 6-8 days, with the route often combined with deliveries to nearby Tamil Nadu clusters. Chennai Port, a short distance away, offers an alternative for coastal shipping of oversized machines, and air freight from Kolkata supports urgent spares and engineer visits.",
    neighbouringStateSlugs: ["tamil-nadu", "kerala", "andhra-pradesh"],
    faqs: [
      {
        q: "How do I request a quotation for a machine in Puducherry?",
        a: "Send RA Machine your material specifications, thickness range, and expected production volume, and we will recommend a suitable fiber laser or robotic welding model. A formal quotation follows, covering machine cost, transport from Kolkata to Puducherry, and on-site installation, tailored to whether you are supplying auto components or electronics assembly work.",
      },
      {
        q: "What is the delivery and installation timeline from Kolkata to Puducherry?",
        a: "Standard machines are typically dispatched within 3-5 weeks of order confirmation, with road transit to Puducherry adding around 6-8 days. RA Machine engineers travel from Kolkata to handle installation, alignment, and commissioning on-site, usually completed within 3-4 working days once the machine and utilities are ready at your facility.",
      },
      {
        q: "Is on-site service and AMC coverage available in Puducherry?",
        a: "Yes. RA Machine's annual maintenance contracts cover periodic servicing and breakdown response for customers across Sedarapet, Thattanchavady, and Mettupalayam. Service engineers are dispatched from our Kolkata headquarters for on-site work, supported by remote diagnostics to resolve straightforward issues quickly without waiting for a physical visit.",
      },
      {
        q: "Does RA Machine offer operator training for Puducherry customers?",
        a: "Training is conducted on-site at your facility as part of installation, covering safe operation, software use, and routine maintenance checks. Puducherry customers can also send operators to RA Machine's training centre in Kolkata for a more in-depth session before the machine goes into full production use.",
      },
      {
        q: "Which RA Machine model suits Puducherry's auto component industry?",
        a: "For auto component fabricators in Sedarapet and Thattanchavady, the RA-F3015-PRO 3 kW fiber laser handles general sheet metal cutting for brackets and chassis parts efficiently, and pairing it with the RA-RW6 robotic welding cell improves consistency on repetitive welds feeding Chennai-area automotive supply chains.",
      },
      {
        q: "Can Puducherry customers get GST invoicing or arrange export through Chennai Port?",
        a: "Yes. RA Machine issues GST-compliant invoices for Puducherry-based buyers, and for units exporting finished parts, we can provide standard commercial documentation to support shipment through nearby Chennai Port. Financing is arranged through your bank or NBFC of choice, as RA Machine does not extend financing directly.",
      },
    ],
  },
  {
    slug: "andaman-and-nicobar-islands",
    name: "Andaman and Nicobar Islands",
    type: "ut",
    tier: "small",
    region: "South",
    capital: "Port Blair",
    overview: [
      "Industrial activity in the Andaman and Nicobar Islands is modest and concentrated around Port Blair, where the local economy leans on fishing, tourism infrastructure, and government-led public works rather than large-scale manufacturing. Junglighat and Prothrapur host the archipelago's small formal industrial estates, home to workshops that fabricate and repair fishing boats, marine hardware, and equipment for port and infrastructure projects.",
      "Given the islands' isolation from mainland supply chains, most steel components and machine parts are either shipped in pre-fabricated or produced locally in smaller workshops, which creates a real but limited need for compact, reliable cutting equipment that local fabricators can operate without depending on frequent mainland sourcing trips.",
    ],
    industries: [
      {
        name: "Fishing & marine equipment fabrication",
        clusters: ["Port Blair"],
        products: ["boat fittings", "marine brackets", "deck hardware"],
        note: "Marine fabricators serving the local fishing fleet need dependable sheet cutting for fittings and hardware, reducing reliance on parts shipped in from the mainland.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Boat building and repair",
        clusters: ["Port Blair", "Junglighat"],
        products: ["hull patches", "structural repair sections", "small boat frames"],
        note: "Small boat builders and repair yards benefit from accurate thin-to-medium sheet cutting for hull sections and repair patches, where turnaround time matters for vessels returning to service.",
        recommendedProductSlugs: ["ra-f1530", "ra-rw6"],
      },
      {
        name: "Light engineering for infrastructure works",
        clusters: ["Port Blair", "Prothrapur"],
        products: ["brackets", "railings", "structural supports"],
        note: "Local infrastructure and port projects require light structural fabrication, where a compact laser cutting machine reduces dependence on components shipped from mainland India.",
        recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
      },
    ],
    industrialAreas: ["Junglighat Industrial Estate", "Prothrapur Industrial Estate"],
    logisticsNote:
      "Given the geography, machines are shipped by sea from Kolkata or Haldia port to Port Blair, with transit typically taking 4-7 days depending on vessel schedules and onward port handling. Air freight from Kolkata covers spares and engineer dispatch for installation and service visits when faster turnaround is required.",
    neighbouringStateSlugs: [],
    faqs: [
      {
        q: "How do I get a quotation for a machine to be shipped to the Andaman and Nicobar Islands?",
        a: "Share your material type, thickness, and intended use with RA Machine, and we will recommend a suitable compact model, typically the RA-F1530, sized for local workshop conditions in Port Blair. The quotation will include machine cost, sea freight from Kolkata port, and on-site installation, since air freight for the machine itself is generally not practical at this size.",
      },
      {
        q: "What is the typical delivery timeline from Kolkata to Port Blair?",
        a: "After order confirmation, machines are dispatched and shipped by sea from Kolkata or Haldia port, with transit typically taking 4-7 days depending on vessel availability, plus port clearance time in Port Blair. RA Machine engineers then travel to the islands to complete installation and commissioning once the machine has cleared port formalities.",
      },
      {
        q: "Is on-site service and AMC support available in the Andaman and Nicobar Islands?",
        a: "Yes, though visit scheduling accounts for the islands' distance from the mainland. RA Machine's AMC plans cover scheduled servicing and breakdown response, with engineers dispatched from Kolkata for on-site work and remote diagnostics used first wherever possible to resolve issues without waiting for a physical visit.",
      },
      {
        q: "Can operators in Port Blair get training on the machine?",
        a: "Basic operational training is provided on-site during installation, covering safe use, routine maintenance, and simple troubleshooting suited to local workshop conditions. Operators who want deeper hands-on experience can also travel to RA Machine's training centre in Kolkata for a more comprehensive session before returning to the islands.",
      },
      {
        q: "Which RA Machine model suits boat building and marine fabrication in Port Blair?",
        a: "The RA-F1530 fiber laser is well suited to the boat building and marine fabrication workshops around Port Blair and Junglighat, handling thin-to-medium sheet cutting for hull sections, fittings, and repair patches in a compact footprint appropriate for smaller island workshops.",
      },
      {
        q: "Can GST invoicing be arranged for Andaman and Nicobar Islands customers?",
        a: "Yes, RA Machine issues GST-compliant invoices for buyers in the Andaman and Nicobar Islands. Financing is arranged through your own bank or NBFC, as RA Machine does not provide financing directly. Given the union territory's distance from major ports, we recommend planning sea freight timelines well ahead of any project deadline.",
      },
    ],
  },
  {
    slug: "lakshadweep",
    name: "Lakshadweep",
    type: "ut",
    tier: "small",
    region: "South",
    capital: "Kavaratti",
    overview: [
      "Lakshadweep has the smallest industrial base among India's union territories, with an economy centred on fishing, coir-related activity, and tourism rather than manufacturing. Kavaratti and the other inhabited islands support small workshop clusters rather than formal industrial estates, where local operators maintain fishing vessels and produce basic coir processing equipment for island use.",
      "Fabrication needs on the islands are modest in scale but persistent, particularly for boat repair and maintenance, since shipping replacement parts from the mainland is slow and costly. A compact, easy-to-maintain cutting machine allows local workshops to produce and repair components on the island rather than waiting weeks for parts to arrive by sea.",
    ],
    industries: [
      {
        name: "Fishing & coir-based light industry",
        clusters: ["Kavaratti"],
        products: ["boat fittings", "coir processing parts", "small metal components"],
        note: "Fishing and coir-related workshops need basic sheet metal fabrication capability locally, reducing dependence on parts shipped from the mainland with long lead times.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Small boat repair and maintenance",
        clusters: ["Kavaratti"],
        products: ["hull patches", "deck fittings", "repair brackets"],
        note: "Boat repair workshops benefit from an on-island cutting machine that shortens turnaround for hull patches and fittings, keeping fishing vessels operational without lengthy mainland shipping delays.",
        recommendedProductSlugs: ["ra-f1530", "ra-rw6"],
      },
    ],
    industrialAreas: ["Small workshop cluster, Kavaratti"],
    logisticsNote:
      "Machines are shipped by sea from Kolkata port to Kavaratti, with transit typically taking 6-9 days given limited vessel frequency to the islands, and onward local transfer between islands adding further time. Air freight from Kolkata covers urgent spares and engineer travel for installation and service visits where sea transit is impractical.",
    neighbouringStateSlugs: [],
    faqs: [
      {
        q: "How do I get a quotation for a machine to be delivered to Lakshadweep?",
        a: "Contact RA Machine with your intended use, whether boat repair or general small-scale fabrication, and we will recommend a compact model such as the RA-F1530. The quotation will include machine price, sea freight from Kolkata port to Kavaratti, and on-site installation, with realistic timelines given the limited shipping frequency to the islands.",
      },
      {
        q: "What is the typical delivery timeline from Kolkata to Lakshadweep?",
        a: "Machines are shipped by sea from Kolkata port, with transit typically taking 6-9 days depending on vessel schedules, and further time needed for local transfer to Kavaratti or other islands. RA Machine engineers travel out afterward to complete installation and commissioning once the machine has arrived and cleared local formalities.",
      },
      {
        q: "Is on-site service and AMC support available for Lakshadweep customers?",
        a: "Yes, with visit scheduling planned around the islands' limited transport frequency. RA Machine's AMC coverage includes scheduled servicing and breakdown response, with engineers dispatched from Kolkata and remote diagnostics used as a first step to resolve issues quickly without always requiring an immediate physical visit.",
      },
      {
        q: "Can workshop operators in Lakshadweep receive training?",
        a: "Basic training on machine operation and maintenance is provided on-site at the time of installation, tailored to small workshop conditions in Kavaratti. Operators who want more thorough instruction can travel to RA Machine's training centre in Kolkata for hands-on sessions before returning to the islands.",
      },
      {
        q: "Which RA Machine model suits Lakshadweep's fishing and boat repair workshops?",
        a: "The RA-F1530 fiber laser is well matched to Lakshadweep's fishing and boat repair workshops, offering thin-to-medium sheet cutting for hull patches, deck fittings, and coir processing parts in a compact machine footprint suited to small island facilities with limited space.",
      },
      {
        q: "Can GST invoicing or financing be arranged for Lakshadweep customers?",
        a: "Yes, RA Machine issues GST-compliant invoices for Lakshadweep buyers. Financing is arranged through your own bank or NBFC rather than directly through RA Machine. Because sea freight to the islands runs on limited schedules, we recommend confirming orders and shipping windows well in advance of any planned installation date.",
      },
    ],
  },
];
