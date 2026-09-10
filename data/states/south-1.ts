/**
 * data/states/south-1.ts — State entries for the South region (batch 1):
 * Tamil Nadu, Karnataka, Telangana, Andhra Pradesh.
 * See data/types.ts for the State/StateIndustry/FaqItem interfaces and
 * data/india-index.ts for the canonical slug/name/tier/region list.
 * To edit: change fields directly. To add a state, append another object
 * matching the State interface below (or start a new sibling file for
 * the next batch and re-export it from the data/states.ts barrel).
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const south1States: State[] = [
  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    type: "state",
    tier: "large",
    region: "South",
    capital: "Chennai",
    overview: [
      "Tamil Nadu is India's most industrialised southern state, anchored by Chennai's automotive and electronics manufacturing belt, often described as the country's Detroit for its cluster of OEM and tier-1 plants around Sriperumbudur and Oragadam. Coimbatore contributes a distinct engineering base built around pumps, motors and textile machinery, while Tiruppur's knitwear exporters run one of India's largest garment production hubs.",
      "Ambur and Vellore add a specialised leather machinery segment feeding the state's tanning and footwear exports. Three working ports, Chennai, Kamarajar at Ennore, and Tuticorin, give Tamil Nadu manufacturers direct export access, which keeps demand steady for precision sheet metal cutting and robotic welding cells feeding both domestic OEM lines and containerised export orders.",
    ],
    industries: [
      {
        name: "Pumps and motors",
        clusters: ["Coimbatore"],
        products: ["centrifugal pumps", "motor housings", "submersible pump components"],
        note: "Coimbatore's pump manufacturers cut mild steel and stainless sheet for housings and brackets in high volumes, making a mid-power fiber laser the standard upgrade from older plasma and punch lines.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Automotive manufacturing",
        clusters: ["Chennai", "Hosur", "Sriperumbudur"],
        products: ["chassis parts", "brackets", "welded sub-assemblies"],
        note: "The Chennai-Hosur-Sriperumbudur auto corridor runs dense tier-1 and tier-2 supply chains where fiber laser cutting and robotic MIG welding cells are paired to hold OEM tolerances at production volumes.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Garment and textile machinery",
        clusters: ["Tiruppur", "Coimbatore"],
        products: ["knitting machine frames", "cutting table components", "textile machine parts"],
        note: "Machine builders serving Tiruppur's knitwear exporters need accurate thin and mid-gauge sheet cutting for frames and enclosures produced on tight delivery schedules.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Leather machinery",
        clusters: ["Ambur", "Vellore"],
        products: ["tannery equipment parts", "footwear machine components"],
        note: "Equipment fabricators supplying Ambur and Vellore's tanning and footwear units rely on consistent sheet metal cutting for machine frames and guards, an application well suited to a compact fiber laser.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: [
      "SIPCOT Sriperumbudur",
      "SIPCOT Oragadam",
      "Ambattur Industrial Estate",
      "Guindy Industrial Estate",
      "SIPCOT Hosur",
      "Tiruppur knitwear cluster",
    ],
    logisticsNote: "Machines move from Kolkata to Chennai and the Sriperumbudur-Oragadam belt by road via NH16 and NH48, or by rail freight, with typical transit of 5-6 days; coastal shipping between Kolkata/Haldia and Chennai or Tuticorin is available for oversized consignments. Air freight from Kolkata covers urgent spares dispatch to Chennai within a day.",
    neighbouringStateSlugs: ["andhra-pradesh", "karnataka", "kerala", "puducherry"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Tamil Nadu?", a: "Share your material thickness, bed size and production volume through our enquiry form and our team will issue a formal quotation covering machine specification, ex-works Kolkata pricing and delivery timeline to your Tamil Nadu facility, whether in Chennai, Coimbatore or Tiruppur." },
      { q: "How long does delivery and installation take from Kolkata to Tamil Nadu?", a: "Road and rail freight transit to Chennai or Coimbatore typically takes 5-6 days from dispatch, after which our engineers travel to site for installation, calibration and commissioning, generally completed within a week of the machine reaching your facility." },
      { q: "Is on-site service and AMC coverage available in Tamil Nadu?", a: "Yes. Engineers are dispatched from our Kolkata headquarters for on-site service, breakdown support and annual maintenance contract visits across Tamil Nadu, backed by remote diagnostics for faster first-response troubleshooting before a site visit is scheduled." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your facility during installation and commissioning, covering machine operation, nesting software and routine maintenance. Additional or refresher training is also available at our Kolkata training centre for teams that prefer hands-on classroom sessions." },
      { q: "Which RA Machine model suits Tamil Nadu's automotive component industry?", a: "For the Chennai-Hosur-Sriperumbudur automotive corridor, the RA-F3015 Pro fiber laser handles general sheet metal fabrication for brackets and chassis parts well, and is frequently paired with the RA-RW6 robotic welding cell for tier-1 and tier-2 suppliers running welded sub-assemblies." },
      { q: "Can Tamil Nadu exporters route machinery purchases through GST and port facilities?", a: "Domestic buyers purchase under standard GST invoicing, while export-oriented units can coordinate delivery through Chennai, Kamarajar or Tuticorin ports for their own outbound shipments. We provide full GST-compliant documentation and can advise on financing options through your bank or NBFC partner." },
    ],
  },
  {
    slug: "karnataka",
    name: "Karnataka",
    type: "state",
    tier: "large",
    region: "South",
    capital: "Bengaluru",
    overview: [
      "Karnataka's manufacturing economy centres on Bengaluru, home to India's aerospace and precision machine tool industry around the Peenya and HAL industrial belts, alongside a dense electronics and auto component base extending to Dharwad. Belagavi, in the state's north, hosts a long-established foundry cluster supplying castings and machined components to industries across the country.",
      "New Mangalore Port gives the state a west coast export outlet distinct from Tamil Nadu's east coast ports. The combination of high-precision aerospace work in Bengaluru and volume foundry and casting output in Belagavi creates parallel demand: fine-tolerance sheet cutting for one, and heavier fabrication capacity for the other.",
    ],
    industries: [
      {
        name: "Aerospace and machine tools",
        clusters: ["Bengaluru", "Peenya", "HAL belt"],
        products: ["aerospace brackets", "precision enclosures", "machine tool components"],
        note: "Bengaluru's aerospace and precision engineering firms need tight-tolerance cutting on thin to mid-gauge sheet, work that suits fiber laser systems with fine cut quality and repeatable accuracy.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Foundries",
        clusters: ["Belagavi"],
        products: ["machine tool castings", "pump and valve castings", "automotive castings"],
        note: "Belagavi's foundry cluster fabricates jigs, fixtures and structural steel supports around casting operations, a heavier fabrication load suited to a mid-power fiber laser.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Auto components",
        clusters: ["Bengaluru", "Dharwad"],
        products: ["chassis brackets", "welded sub-frames", "sheet metal housings"],
        note: "Auto component suppliers in Bengaluru and Dharwad increasingly add robotic MIG welding alongside fiber laser cutting to keep bracket and sub-frame production in-house at consistent quality.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Electronics manufacturing",
        clusters: ["Bengaluru"],
        products: ["equipment enclosures", "panel housings", "rack frames"],
        note: "Electronics manufacturers need clean, burr-free cutting on thin stainless and mild steel for enclosures and panel housings, a strength of compact fiber laser machines.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: [
      "Peenya Industrial Area",
      "Bommasandra Industrial Area",
      "Udyambag Industrial Estate, Belagavi",
      "Machhe Industrial Estate, Belagavi",
      "Hubballi-Dharwad Industrial Area",
    ],
    logisticsNote: "Consignments to Bengaluru and the Peenya-Bommasandra belt move by road via NH75 and NH48, or by rail freight, with typical transit of 5-6 days from Kolkata; Belagavi and Hubballi-Dharwad add a further day by road. New Mangalore Port also supports coastal shipping for larger machines routed to the state's west coast facilities.",
    neighbouringStateSlugs: ["maharashtra", "goa", "andhra-pradesh", "telangana", "tamil-nadu", "kerala"],
    faqs: [
      { q: "How do I request a quote for a machine to be installed in Karnataka?", a: "Send us your cutting or welding requirement, including material type, thickness and bed size, through our enquiry form. We will respond with a detailed quotation and delivery schedule for your Bengaluru, Belagavi or Hubballi-Dharwad facility." },
      { q: "What is the typical delivery time from Kolkata to Karnataka?", a: "Road and rail transit to Bengaluru typically takes 5-6 days from dispatch, with Belagavi and northern Karnataka locations taking a day or so longer. Our engineers arrive on site shortly after the machine to carry out installation and commissioning." },
      { q: "Do you provide on-site service and AMC support in Karnataka?", a: "Yes, our engineers travel from Kolkata for on-site breakdown support, preventive maintenance and annual maintenance contract visits anywhere in Karnataka, including Bengaluru and Belagavi, supported by remote diagnostics to resolve many issues without a site visit." },
      { q: "Is operator training available locally or only in Kolkata?", a: "Operator training is conducted on-site at your Karnataka facility as part of installation and commissioning. We also run structured training sessions at our Kolkata training centre for operators who want additional hands-on practice away from production pressure." },
      { q: "Which machine is best suited to Karnataka's aerospace and precision engineering industry?", a: "For Bengaluru's aerospace and precision engineering base, the RA-F1530 and RA-F3015 Pro fiber laser machines deliver the fine cut quality and tight tolerance needed for brackets and enclosures, while Belagavi's foundry-linked fabrication favours the RA-F3015 Pro for heavier jig and fixture work." },
      { q: "Are financing and GST-compliant documentation available for Karnataka buyers?", a: "All purchases are invoiced with full GST-compliant documentation, and we can guide you toward financing routes through your bank or an equipment finance NBFC. Units exporting through New Mangalore Port can also coordinate delivery scheduling around their own shipment timelines." },
    ],
  },
  {
    slug: "telangana",
    name: "Telangana",
    type: "state",
    tier: "large",
    region: "South",
    capital: "Hyderabad",
    overview: [
      "Telangana's industrial economy is built around Hyderabad, home to one of India's largest pharmaceutical and bulk drug manufacturing bases centred on Genome Valley, alongside a growing precision engineering and machine tool sector in Patancheru and Medchal. Auto component manufacturers in and around Hyderabad supply both domestic OEMs and export orders.",
      "Pharmaceutical equipment fabricators and machine tool builders in the Patancheru-Medchal belt need consistent stainless steel and mild steel cutting for reactor skids, frames and enclosures, a requirement that has driven steady adoption of fiber laser cutting over older mechanical cutting methods as Telangana's engineering base has matured over the past decade.",
    ],
    industries: [
      {
        name: "Pharma and bulk drugs equipment",
        clusters: ["Hyderabad", "Genome Valley"],
        products: ["reactor skids", "equipment frames", "stainless enclosures"],
        note: "Fabricators supplying Hyderabad's pharmaceutical and bulk drug plants need precise stainless steel cutting for equipment frames and enclosures built to pharma-grade finish standards.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Precision engineering and machine tools",
        clusters: ["Patancheru", "Medchal"],
        products: ["machine tool bodies", "jigs and fixtures", "precision brackets"],
        note: "Machine tool and precision engineering units in Patancheru and Medchal run varied sheet thicknesses, making a general-purpose fiber laser the practical choice for mixed-batch production.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Auto components",
        clusters: ["Hyderabad"],
        products: ["welded brackets", "chassis components", "sheet metal sub-assemblies"],
        note: "Hyderabad's auto component suppliers pair fiber laser cutting with robotic MIG welding to produce brackets and sub-assemblies at the consistent quality tier-1 OEM contracts require.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
    ],
    industrialAreas: [
      "Patancheru Industrial Area",
      "IDA Jeedimetla",
      "IDA Nacharam",
      "IDA Bollaram",
      "Pashamylaram Industrial Area",
    ],
    logisticsNote: "Machines dispatched from Kolkata to Hyderabad and the Patancheru-Medchal belt travel by road via NH16 and NH65 or by rail freight, with typical transit of 4-5 days. Air freight from Kolkata is used for urgent spares dispatch to Hyderabad, generally arriving within a day.",
    neighbouringStateSlugs: ["maharashtra", "chhattisgarh", "andhra-pradesh", "karnataka"],
    faqs: [
      { q: "How do I get a quotation for a laser cutting or welding machine in Telangana?", a: "Submit your material thickness, bed size and production requirement through our enquiry form and our team will prepare a formal quotation covering machine specification, pricing and delivery timeline to your Hyderabad or Patancheru facility." },
      { q: "How long does delivery and installation take from Kolkata to Telangana?", a: "Road and rail transit to Hyderabad typically takes 4-5 days from dispatch. Once the machine reaches your Telangana facility, our engineers carry out installation, calibration and commissioning, usually completed within a few days." },
      { q: "Is on-site service and AMC coverage offered in Telangana?", a: "Yes, engineers are dispatched from our Kolkata headquarters for on-site service and annual maintenance contract visits across Telangana, including Hyderabad, Patancheru and Medchal, with remote diagnostics used first to speed up troubleshooting wherever possible." },
      { q: "Where can operators be trained for machines installed in Telangana?", a: "Operator training is provided on-site at your Telangana facility as part of installation. Teams that prefer additional structured training can also attend sessions at our Kolkata training centre, covering machine operation, software and maintenance in depth." },
      { q: "Which RA Machine model fits Telangana's pharma and precision engineering industry best?", a: "For Hyderabad's pharma equipment fabricators, the RA-F3015 Pro fiber laser handles stainless steel enclosure and frame cutting well, while the RA-F1530 suits finer thin-gauge work; Patancheru's machine tool units generally standardise on the RA-F3015 Pro for its general-purpose capacity." },
      { q: "Are GST-compliant invoicing and financing options available in Telangana?", a: "All Telangana purchases are invoiced with full GST-compliant documentation. We can also guide buyers toward equipment financing through banks or NBFCs, and support export-oriented units in Hyderabad with documentation needed for their own outbound shipments." },
    ],
  },
  {
    slug: "andhra-pradesh",
    name: "Andhra Pradesh",
    type: "state",
    tier: "large",
    region: "South",
    capital: "Amaravati",
    overview: [
      "Andhra Pradesh's manufacturing base is anchored by Visakhapatnam's shipbuilding and heavy fabrication industry, supported by three working ports at Visakhapatnam, Kakinada and Krishnapatnam that give the state a strong east coast export position. Vijayawada and Nellore host a growing pharmaceutical manufacturing base, while Chittoor supplies auto and tractor components to nearby Tamil Nadu and Karnataka OEM plants.",
      "Visakhapatnam's shipyards and heavy engineering units work with thick steel plate for hull sections and structural fabrication, demand that sits at the upper end of fiber laser cutting capacity. Cement and mining equipment manufacturers add further heavy fabrication load across the state's industrial belts.",
    ],
    industries: [
      {
        name: "Shipbuilding and heavy fabrication",
        clusters: ["Visakhapatnam"],
        products: ["hull sections", "structural steel", "heavy machine frames"],
        note: "Visakhapatnam's shipyards and heavy fabrication units cut thick steel plate for hull sections and structural members, work that requires high-power fiber laser capacity beyond standard sheet metal machines.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
      },
      {
        name: "Pharmaceutical manufacturing",
        clusters: ["Vijayawada", "Nellore"],
        products: ["equipment frames", "stainless enclosures", "process skids"],
        note: "Pharma equipment fabricators around Vijayawada and Nellore need clean stainless steel cutting for process skids and enclosures built to pharma-grade finish requirements.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Auto and tractor components",
        clusters: ["Chittoor"],
        products: ["tractor brackets", "chassis parts", "welded sub-assemblies"],
        note: "Chittoor's auto and tractor component suppliers feed nearby OEM plants and increasingly combine fiber laser cutting with robotic welding to hold consistent quality at volume.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Cement and mining equipment",
        clusters: ["Visakhapatnam", "Kakinada"],
        products: ["equipment housings", "structural supports", "wear plates"],
        note: "Cement and mining equipment manufacturers along the coastal belt fabricate heavy structural supports and wear components, work suited to high-power fiber laser cutting on thick plate.",
        recommendedProductSlugs: ["ra-f6020-hd"],
      },
    ],
    industrialAreas: [
      "Auto Nagar, Vijayawada",
      "JNPC Kakinada",
      "Duvvada Industrial Area, Visakhapatnam",
      "Gajuwaka Industrial Area, Visakhapatnam",
    ],
    logisticsNote: "Machines dispatched from Kolkata to Visakhapatnam and the Vijayawada-Kakinada belt travel by road via NH16 or by rail freight, with typical transit of 3-4 days given the coastal route's proximity to Kolkata. Coastal shipping between Kolkata/Haldia and Visakhapatnam or Kakinada port is also used for heavier machines destined for shipyard and heavy fabrication buyers.",
    neighbouringStateSlugs: ["odisha", "chhattisgarh", "telangana", "tamil-nadu", "karnataka"],
    faqs: [
      { q: "How do I get a quote for a machine to be delivered in Andhra Pradesh?", a: "Share your cutting or welding requirement, including material thickness, plate size and production volume, through our enquiry form. We will issue a formal quotation with pricing and delivery timeline to your Visakhapatnam, Vijayawada or Kakinada facility." },
      { q: "What is the typical delivery and installation time from Kolkata to Andhra Pradesh?", a: "Given the coastal proximity, road and rail transit to Visakhapatnam typically takes 3-4 days from dispatch, among the shortest routes from our Kolkata base. Our engineers follow shortly after for installation, calibration and commissioning at your facility." },
      { q: "Is on-site service and AMC support available in Andhra Pradesh?", a: "Yes, our engineers are dispatched from Kolkata for on-site service, breakdown support and annual maintenance contract visits across Andhra Pradesh, including Visakhapatnam's shipyard belt, backed by remote diagnostics for faster initial troubleshooting." },
      { q: "Can operators be trained on-site or must they travel to Kolkata?", a: "We provide hands-on operator training at your Andhra Pradesh facility as part of installation and commissioning. Additional training is also available at our Kolkata training centre for operators who want further structured practice." },
      { q: "Which RA Machine model suits Andhra Pradesh's shipbuilding and heavy fabrication industry?", a: "For Visakhapatnam's shipbuilding and heavy fabrication sector, the RA-F6020 HD and RA-F12K heavy duty fiber laser machines handle thick plate cutting for hull sections and structural steel, while Vijayawada's pharma and auto component fabricators are typically well served by the RA-F3015 Pro." },
      { q: "Can Andhra Pradesh manufacturers coordinate exports through the state's ports with GST documentation?", a: "Domestic purchases carry standard GST-compliant invoicing, and export-oriented units can coordinate machine delivery timing with their own outbound shipments through Visakhapatnam, Kakinada or Krishnapatnam ports. We can also advise on financing routes through your bank or an equipment finance NBFC." },
    ],
  },
];
