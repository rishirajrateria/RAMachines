/**
 * Central India state data for the "laser cutting machines in <state>"
 * and "robotic welding in <state>" landing pages.
 *
 * To edit a state: update the matching object below directly.
 * To add a new state: see the `State` interface in data/types.ts for the
 * required shape, and data/india-index.ts for the canonical list of state/UT
 * slugs (use only those slugs in neighbouringStateSlugs). Keep facts real —
 * clusters, industrial estates and ports must be genuine, named places.
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const centralStates: State[] = [
  {
    slug: "madhya-pradesh",
    name: "Madhya Pradesh",
    type: "state",
    tier: "large",
    region: "Central",
    capital: "Bhopal",
    overview: [
      "Madhya Pradesh sits at India's geographic centre, and Pithampur near Indore has grown into one of the country's most significant auto component hubs, often referred to as the Detroit of India for its density of vehicle and component manufacturers. Indore and Pithampur also carry a substantial pharmaceutical manufacturing base, supported by textile machinery workshops in the same corridor.",
      "Bhopal's Mandideep estate specialises in heavy electrical equipment, while Satna and Katni in the state's east supply cement and mining equipment tied to regional mineral deposits. This spread of automotive volume, pharma equipment and heavy electrical fabrication sustains demand for both precision thin-sheet and mid-thickness plate cutting across the state.",
    ],
    industries: [
      {
        name: "Auto components",
        clusters: ["Pithampur"],
        products: ["chassis parts", "brackets", "body panels", "welded sub-assemblies"],
        note: "Pithampur's dense auto component hub needs high-repeatability sheet metal cutting and robotic welding to keep pace with vehicle assembly schedules across multiple OEM supply chains.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Pharma equipment",
        clusters: ["Indore", "Pithampur"],
        products: ["process equipment", "stainless skids", "enclosures"],
        note: "Pharma manufacturing clusters around Indore and Pithampur require precise stainless steel cutting for process equipment and skid frames built to pharmaceutical fabrication standards.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Textile machinery",
        clusters: ["Indore"],
        products: ["loom parts", "machine frames"],
        note: "Textile machinery workshops in Indore fabricate frames and spare parts where in-house laser cutting shortens turnaround compared to outsourced blanking.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Heavy electrical equipment",
        clusters: ["Bhopal"],
        products: ["transformer tanks", "panel enclosures", "structural frames"],
        note: "Heavy electrical equipment manufacturers in Bhopal's Mandideep estate need mid-to-heavy plate cutting for transformer tanks and structural frames, often paired with robotic welding for consistent seam quality.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd", "ra-rw6"],
      },
      {
        name: "Cement & mining equipment",
        clusters: ["Satna", "Katni"],
        products: ["equipment frames", "wear liners", "structural fabrication"],
        note: "Cement and mining equipment fabricators around Satna and Katni work with thick plate for structural frames and wear components, where higher-power fiber laser cutting improves throughput on heavier jobs.",
        recommendedProductSlugs: ["ra-f6020-hd"],
      },
    ],
    industrialAreas: ["Pithampur Industrial Area", "Mandideep Industrial Area (Bhopal)", "Malanpur Industrial Area (Gwalior)", "Dewas Industrial Area"],
    logisticsNote:
      "Road freight from Kolkata to Madhya Pradesh's industrial belt runs via NH19 and NH34/NH44 toward Bhopal, Indore and Pithampur, with typical transit of 3-5 days given the state's central location. Rail freight is a practical option for heavier machines moving to Bhopal or Indore, and air freight for spares connects through Kolkata to Indore or Bhopal within 1-2 days.",
    neighbouringStateSlugs: ["rajasthan", "uttar-pradesh", "chhattisgarh", "maharashtra", "gujarat"],
    faqs: [
      {
        q: "How do I request a quote for our Madhya Pradesh facility?",
        a: "Share your material type, thickness range and monthly volume with RA Machine, and we will recommend a suitable model along with a quotation covering machine cost, freight to Indore, Pithampur or Bhopal, and installation. Auto component buyers in Pithampur can also request reference cut samples before ordering.",
      },
      {
        q: "What is the delivery and installation timeline from Kolkata to Madhya Pradesh?",
        a: "Given the state's central location, machines typically reach Indore, Pithampur or Bhopal within 2-3 weeks of order confirmation, with road transit of around 3-5 days. RA Machine engineers travel from Kolkata to complete on-site installation, calibration and test cuts, usually finishing within a day or two of arrival.",
      },
      {
        q: "Is on-site service and AMC coverage available in Madhya Pradesh?",
        a: "Yes. RA Machine dispatches service engineers from its Kolkata headquarters for on-site visits across Madhya Pradesh, backed by remote diagnostics for faster troubleshooting. AMC plans cover scheduled preventive maintenance and priority breakdown response for clusters including Pithampur, Indore and Bhopal.",
      },
      {
        q: "Can operators at our Madhya Pradesh plant be trained on the machine?",
        a: "Training is conducted on-site at your Madhya Pradesh facility during commissioning, covering safe operation, cutting parameters and nesting software. Operators can also attend a more extensive hands-on programme at RA Machine's training centre in Kolkata for deeper exposure before ramping up production.",
      },
      {
        q: "Which RA Machine model suits Madhya Pradesh's auto component industry?",
        a: "For Pithampur's dense auto component manufacturing base, the RA-F3015-Pro 3 kW fiber laser is the practical workhorse for general sheet metal cutting, often combined with the RA-RW6 robotic welding cell for chassis brackets and welded sub-assemblies produced at high volume for OEM supply chains.",
      },
      {
        q: "How does interstate GST and logistics work for Madhya Pradesh buyers?",
        a: "RA Machine issues GST-compliant invoices for buyers across Madhya Pradesh, and being landlocked, the state's fabricators typically move finished goods onward by road or rail to Gujarat or Maharashtra ports for export. Interstate e-way bill processing is straightforward given the well-established freight corridors linking Kolkata with Bhopal and Indore.",
      },
    ],
  },
  {
    slug: "chhattisgarh",
    name: "Chhattisgarh",
    type: "state",
    tier: "medium",
    region: "Central",
    capital: "Raipur",
    overview: [
      "Chhattisgarh is one of India's leading steel-producing states, with Raipur, Bhilai and Bilaspur forming a dense corridor of steel plants and sponge iron units built on the state's substantial iron ore and coal reserves. Bhilai Steel Plant is among the country's largest integrated steel producers, and the surrounding ancillary industry fabricates structural steel and equipment parts at scale.",
      "Korba, further east, hosts major power generation and heavy power equipment manufacturing tied to the state's coal belt, while cement production is a significant secondary industry. This concentration of steel, power equipment and mining machinery fabrication drives consistent demand for thick-plate laser cutting capable of handling heavy structural steel.",
    ],
    industries: [
      {
        name: "Steel & sponge iron",
        clusters: ["Raipur", "Bhilai", "Bilaspur"],
        products: ["structural steel", "plate fabrication", "equipment components"],
        note: "The steel and sponge iron corridor around Raipur and Bhilai generates continuous demand for heavy plate cutting to fabricate structural steel and equipment components for the plants themselves and their ancillary units.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
      },
      {
        name: "Power equipment",
        clusters: ["Korba"],
        products: ["boiler components", "structural frames", "equipment housings"],
        note: "Power equipment fabrication in Korba requires thick-plate cutting and robust welding for boiler components and structural frames used in the region's power generation facilities.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw10"],
      },
      {
        name: "Mining machinery",
        clusters: ["Raipur", "Bilaspur"],
        products: ["equipment frames", "wear plates", "repair fabrication"],
        note: "Mining machinery fabrication and repair work around Raipur and Bilaspur relies on heavy plate cutting for wear-resistant components and equipment frames used in the state's mineral extraction industry.",
        recommendedProductSlugs: ["ra-f6020-hd"],
      },
      {
        name: "Cement",
        clusters: ["Raipur", "Bilaspur"],
        products: ["kiln structures", "conveyor frames", "equipment housings"],
        note: "Cement plant fabrication needs mid-to-heavy plate cutting for kiln and conveyor structures, where a higher-power fiber laser improves cutting speed and reduces secondary finishing.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f3015-pro"],
      },
    ],
    industrialAreas: ["Urla Industrial Area (Raipur)", "Siltara Industrial Area (Raipur)", "Sector-1 Industrial Estate (Bhilai)", "Borai Industrial Area (Durg)"],
    logisticsNote:
      "Road freight from Kolkata to Chhattisgarh's steel belt moves via NH16 and NH130 toward Raipur, Bhilai and Bilaspur, with typical transit of 3-4 days given the relatively direct corridor. Rail freight is a well-established option for heavy plate-handling machinery given the region's dense freight rail network built around its steel industry, and air freight for spares connects through Kolkata to Raipur within a day.",
    neighbouringStateSlugs: ["madhya-pradesh", "maharashtra", "odisha", "jharkhand", "uttar-pradesh", "telangana", "andhra-pradesh"],
    faqs: [
      {
        q: "How do I get a quote for a heavy plate laser cutting machine for our Chhattisgarh unit?",
        a: "Share your plate thickness range, typical job sizes and production volume with RA Machine, and we will recommend a suitable high-power model and provide a quotation covering machine cost, freight to Raipur, Bhilai or Bilaspur, and installation. Given the steel-heavy demand in this region, we often recommend our higher-power fiber laser range.",
      },
      {
        q: "What is the delivery and installation timeline from Kolkata to Chhattisgarh?",
        a: "Machines typically reach Raipur, Bhilai or Bilaspur within 2-3 weeks of order confirmation, with road transit generally taking 3-4 days along the NH16/NH130 corridor, or by rail freight for heavier equipment. RA Machine engineers travel from Kolkata to complete on-site installation and calibration, usually within a day or two of arrival.",
      },
      {
        q: "Is on-site service and AMC support available in Chhattisgarh?",
        a: "Yes. RA Machine dispatches service engineers from its Kolkata headquarters for on-site visits to Chhattisgarh's steel and power equipment clusters, supported by remote diagnostics for faster issue resolution. AMC plans cover scheduled preventive maintenance and priority breakdown response for units in Raipur, Bhilai and Korba.",
      },
      {
        q: "Can our operators in Chhattisgarh be trained on the machine?",
        a: "Operator training is provided on-site at your Chhattisgarh facility during commissioning, covering safe operation of heavy plate cutting equipment and routine maintenance. Operators can also attend an in-depth hands-on training programme at RA Machine's training centre in Kolkata, useful for teams new to high-power fiber laser operation.",
      },
      {
        q: "Which RA Machine model suits Chhattisgarh's steel and heavy engineering industry?",
        a: "For the steel and sponge iron corridor around Raipur and Bhilai, the RA-F6020-HD 6 kW fiber laser is well suited to heavy plate and structural steel fabrication, with the RA-F12K recommended for units handling the thickest plate work typical of steel plant ancillary and power equipment manufacturing in Korba.",
      },
      {
        q: "How does interstate GST and logistics work for Chhattisgarh buyers exporting finished goods?",
        a: "RA Machine issues GST-compliant invoices for Chhattisgarh buyers, and as a landlocked state, fabricators typically route export shipments through ports in Odisha or Andhra Pradesh, or via rail to Kolkata and Haldia. Interstate e-way bill processing is straightforward given the established rail and road freight corridors serving the steel belt.",
      },
    ],
  },
];
