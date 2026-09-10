/**
 * data/states/northeast-1.ts — State entries for the North-East region
 * (batch 1): Assam, Arunachal Pradesh, Manipur, Meghalaya.
 * See data/types.ts for the State/StateIndustry/FaqItem interfaces and
 * data/india-index.ts for the canonical slug/name/tier/region list.
 * To edit: change fields directly. To add a state, append another object
 * matching the State interface below (or start a new sibling file for
 * the next batch and re-export it from the data/states.ts barrel).
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const northeast1States: State[] = [
  {
    slug: "assam",
    name: "Assam",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Dispur",
    overview: [
      "Assam anchors the North-East's industrial base, built around two distinct pillars: upper Assam's oil and gas belt around Dibrugarh and Tinsukia, home to Oil India Limited and long-standing ONGC operations, and the tea economy that runs through Dibrugarh, Tinsukia and the Brahmaputra valley's estates. Guwahati functions as the region's commercial gateway, with light engineering and equipment repair units clustered around the city serving trade that moves through it toward the rest of the North-East.",
      "Fabrication demand in Assam is shaped by this mix: tea garden machinery needs replacement parts and structural repairs, while oilfield service contractors require accurately cut brackets, skids and pressure-rated component housings. Guwahati's growing trade and logistics activity adds steady demand for general sheet metal work supporting warehousing, transport equipment and small-scale manufacturing.",
    ],
    industries: [
      {
        name: "Tea machinery",
        clusters: ["Dibrugarh", "Tinsukia"],
        products: ["withering trough frames", "rolling machine parts", "dryer components"],
        note: "Workshops serving upper Assam's tea estates fabricate and repair machinery frames and sheet metal enclosures through the year, work well suited to a compact fiber laser that can run mixed small batches without long changeovers.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Oil and gas equipment",
        clusters: ["Dibrugarh"],
        products: ["equipment skids", "brackets", "wellhead component housings"],
        note: "Fabricators supporting Oil India Limited and ONGC operations around Dibrugarh need precise, repeatable cutting for structural steel and plate components, a case where a higher-power fiber laser earns its keep on thicker gauge work.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd"],
      },
      {
        name: "Light engineering and trade",
        clusters: ["Guwahati"],
        products: ["signage", "general fabrication", "equipment enclosures"],
        note: "Guwahati's position as the North-East's commercial hub supports a spread of small fabrication and signage businesses that favour a versatile CO2 or entry fiber laser over outsourcing cutting work elsewhere.",
        recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
      },
    ],
    industrialAreas: [
      "Bamunimaidam Industrial Estate (Guwahati)",
      "Namrup Industrial Area",
      "Tinsukia Industrial Growth Centre",
    ],
    logisticsNote: "Machines dispatched from Kolkata reach Guwahati and upper Assam by road through the Siliguri corridor and NH27, with rail freight also routed via New Jalpaiguri, and typical transit runs 5-7 days given the distance involved. Air freight from Kolkata to Guwahati covers urgent spares dispatch within a day when a breakdown cannot wait for road transit.",
    neighbouringStateSlugs: ["west-bengal", "arunachal-pradesh", "nagaland", "manipur", "meghalaya", "tripura", "mizoram"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Assam?", a: "Send us your material thickness, bed size requirement and production volume through our enquiry form. We will issue a formal quotation covering machine specification, ex-works Kolkata pricing and estimated delivery timeline to your facility in Guwahati, Dibrugarh, Tinsukia or elsewhere in Assam." },
      { q: "How long does delivery and installation take from Kolkata to Assam?", a: "Road and rail transit from Kolkata to Assam typically takes 5-7 days given the distance via the Siliguri corridor. Once the machine reaches your facility, our engineers travel to site to complete installation, calibration and commissioning, usually within a week." },
      { q: "Is on-site service and AMC coverage available in Assam?", a: "Yes. Engineers are dispatched from our Kolkata headquarters for on-site service and annual maintenance contract visits anywhere in Assam, including Dibrugarh and Tinsukia, supported by remote diagnostics that resolve many faults before a site visit is even needed." },
      { q: "Can operators in Assam be trained locally or must they travel to Kolkata?", a: "On-site operator training is included during installation and commissioning at your Assam facility, covering machine operation, cutting parameters and routine maintenance. Teams that want deeper hands-on practice can also send operators to our training centre in Kolkata." },
      { q: "Which RA Machine model suits Assam's tea machinery and oil field fabrication?", a: "For tea garden machinery fabrication around Dibrugarh and Tinsukia, the compact RA-F1530 handles most sheet work efficiently. Fabricators supporting oil and gas equipment on thicker plate typically move up to the RA-F3015 Pro or RA-F6020 HD depending on gauge." },
      { q: "What financing and interstate logistics considerations apply for buyers in Assam?", a: "Purchases follow standard interstate GST invoicing regardless of whether your unit is in Guwahati or upper Assam. Given the longer transit distance from Kolkata, we recommend planning installation scheduling in advance, and financing through your bank or NBFC partner can be arranged alongside the order." },
    ],
  },
  {
    slug: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Itanagar",
    overview: [
      "Arunachal Pradesh has India's smallest organised industrial base among the North-Eastern states, shaped by its mountainous terrain and border location along the Himalayan frontier. Most fabrication activity centres on Itanagar and Naharlagun, where small workshops support hydropower project construction, border-road infrastructure and government building works rather than large-scale manufacturing.",
      "Handicrafts, particularly bamboo and cane work alongside traditional weaving, remain economically significant but sit outside metal fabrication demand. What sheet metal work exists is tied to hydropower plant components, water supply infrastructure and structural steel for public works, generating occasional but real demand for compact, reliable cutting equipment that a small local workshop can operate without a large technical team.",
    ],
    industries: [
      {
        name: "Hydropower and infrastructure fabrication",
        clusters: ["Itanagar", "Naharlagun"],
        products: ["penstock brackets", "structural steel components", "site fabrication parts"],
        note: "Contractors working on hydropower and border-infrastructure projects need dependable, low-maintenance sheet cutting for brackets and structural parts, making a compact fiber laser a practical fit for a small local fabrication shop.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Handicrafts and light fabrication",
        clusters: ["Itanagar"],
        products: ["signage", "display fittings", "small metal fixtures"],
        note: "Signage and small metal fixture work around Itanagar is limited in volume but benefits from a versatile CO2 laser that can cut and engrave both metal and non-metal materials on one machine.",
        recommendedProductSlugs: ["ra-c1390"],
      },
    ],
    industrialAreas: ["Naharlagun Industrial Estate", "Banderdewa Industrial Area"],
    logisticsNote: "Machines move from Kolkata toward Itanagar and Naharlagun by road via the Siliguri corridor and NH27 into Assam before connecting roads climb into Arunachal Pradesh, with realistic transit of 6-8 days given the terrain. Air freight from Kolkata to Guwahati, followed by road onward, is the practical route for urgent spares given the longer overland distance.",
    neighbouringStateSlugs: ["assam", "nagaland"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or CO2 machine in Arunachal Pradesh?", a: "Share your material type, thickness and expected usage through our enquiry form and our team will prepare a formal quotation with ex-works Kolkata pricing and a realistic delivery timeline to your facility in Itanagar, Naharlagun or elsewhere in Arunachal Pradesh." },
      { q: "How long does delivery and installation take from Kolkata to Arunachal Pradesh?", a: "Given the mountainous terrain and overland distance, transit from Kolkata typically takes 6-8 days via Assam and connecting roads. Our engineers travel to site once the machine arrives to carry out installation, calibration and commissioning, usually within a week of arrival." },
      { q: "Is on-site service and AMC coverage available in Arunachal Pradesh?", a: "Yes, engineers are dispatched from our Kolkata headquarters for on-site service and annual maintenance visits across Arunachal Pradesh, though scheduling accounts for the longer travel time. Remote diagnostics help resolve many issues quickly before a site visit becomes necessary." },
      { q: "Can operators be trained locally in Arunachal Pradesh?", a: "On-site training is provided at your facility during installation, covering safe operation, basic maintenance and cutting parameters suited to your material mix. Given the small scale of most local workshops, we also welcome operators travelling to our Kolkata training centre for a more thorough hands-on session." },
      { q: "Which RA Machine model suits Arunachal Pradesh's hydropower and infrastructure fabrication work?", a: "For hydropower and border-infrastructure fabrication around Itanagar and Naharlagun, the compact RA-F1530 fiber laser is well suited to structural brackets and site fabrication parts, while the RA-C1390 CO2 machine handles signage and mixed-material work for smaller workshops." },
      { q: "What logistics considerations apply for buyers in Arunachal Pradesh?", a: "Interstate GST invoicing applies as standard regardless of the longer transit distance. Because Arunachal Pradesh's terrain extends delivery timelines, we recommend confirming site access and power availability early, and financing through your bank or NBFC partner can be arranged alongside the purchase order." },
    ],
  },
  {
    slug: "manipur",
    name: "Manipur",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Imphal",
    overview: [
      "Manipur's manufacturing activity concentrates around Imphal, where handloom machinery servicing the state's well-established weaving tradition sits alongside light engineering supporting local infrastructure works. Handloom and handicraft output is a genuine economic pillar in the Imphal valley, and the workshops that build and repair loom frames and fittings form a small but steady fabrication segment.",
      "Bamboo processing adds a second strand of demand, with equipment for treatment and shaping requiring metal frames and fixtures. Beyond these, general fabrication supports municipal and road infrastructure projects around Imphal. The scale is modest throughout, favouring compact, easy-to-operate cutting equipment over heavy industrial installations.",
    ],
    industries: [
      {
        name: "Handloom machinery",
        clusters: ["Imphal"],
        products: ["loom frames", "shuttle fittings", "machine brackets"],
        note: "Workshops building and repairing handloom machinery for Imphal's weaving units need accurate small-batch sheet cutting for frames and fittings, work that a compact fiber laser handles well without requiring a large production setup.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Bamboo processing equipment",
        clusters: ["Imphal"],
        products: ["treatment equipment frames", "processing fixtures"],
        note: "Fabricators supplying bamboo processing equipment need durable metal frames and fixtures cut to consistent tolerances, a good fit for a compact fiber laser running mixed low-volume orders.",
        recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
      },
      {
        name: "Light engineering and infrastructure",
        clusters: ["Imphal"],
        products: ["structural brackets", "gate and railing fabrication", "signage"],
        note: "General fabrication supporting local infrastructure and municipal works around Imphal draws on the same compact machines used for handloom and bamboo processing equipment, keeping the local fabrication base versatile.",
        recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
      },
    ],
    industrialAreas: ["Takyelpat Industrial Estate (Imphal)", "Lamsang Industrial Growth Centre"],
    logisticsNote: "Machines dispatched from Kolkata reach Imphal by road via the Siliguri corridor, NH27 and onward highway links through Assam and Nagaland, with typical transit of 6-8 days given the distance and terrain. Air freight from Kolkata to Imphal is the practical option for urgent spares when road transit time is not workable.",
    neighbouringStateSlugs: ["nagaland", "mizoram", "assam"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or CO2 machine in Manipur?", a: "Share your material thickness and expected usage through our enquiry form and our team will prepare a formal quotation with ex-works Kolkata pricing and a realistic delivery timeline to your facility in Imphal or elsewhere in Manipur." },
      { q: "How long does delivery and installation take from Kolkata to Manipur?", a: "Road transit from Kolkata to Imphal typically takes 6-8 days given the distance via the Siliguri corridor and onward highway links. Our engineers travel to site once the machine arrives to complete installation, calibration and commissioning, usually within a week of arrival." },
      { q: "Is on-site service and AMC coverage available in Manipur?", a: "Yes, engineers are dispatched from our Kolkata headquarters for on-site service and annual maintenance contract visits in Manipur, with scheduling accounting for the longer travel distance. Remote diagnostics support faster first-response troubleshooting ahead of any site visit." },
      { q: "Can operators be trained locally in Manipur?", a: "On-site operator training is provided at your Imphal facility during installation and commissioning, covering safe operation and routine maintenance. Operators can also travel to our Kolkata training centre for a more extensive hands-on session covering nesting software and advanced cutting parameters." },
      { q: "Which RA Machine model suits Manipur's handloom machinery industry?", a: "For handloom machinery fabrication around Imphal, the compact RA-F1530 fiber laser suits loom frame and fitting work well, while the RA-C1390 CO2 machine is a practical choice for workshops that also need to cut or engrave non-metal materials." },
      { q: "What logistics considerations apply for buyers in Manipur?", a: "Standard interstate GST invoicing applies to purchases in Manipur. Given the longer transit distance from Kolkata, we recommend confirming site readiness and power supply ahead of dispatch, and financing through your bank or NBFC partner can be arranged alongside the order." },
    ],
  },
  {
    slug: "meghalaya",
    name: "Meghalaya",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Shillong",
    overview: [
      "Meghalaya's industrial base is the most concentrated in the North-East around a single corridor, the Byrnihat belt straddling the Meghalaya-Assam border near Guwahati, where cement plants and allied industries have built up over decades on the strength of local limestone reserves. Coal and limestone mining across the Khasi and Jaintia Hills feeds both cement production and demand for mining and material-handling equipment fabrication.",
      "Food processing, particularly for the state's fruit and spice produce, adds a further layer of light manufacturing activity around Shillong. Fabricators serving the Byrnihat cement belt need equipment component repair and structural steel work, while mining equipment fabrication supports the extraction operations further east, together sustaining a small but genuine base for sheet metal cutting.",
    ],
    industries: [
      {
        name: "Cement and allied industries",
        clusters: ["Byrnihat"],
        products: ["equipment component parts", "structural steel fabrication", "plant maintenance parts"],
        note: "Fabricators supporting the Byrnihat cement belt need reliable cutting for equipment components and structural steel, work that a mid-power fiber laser handles efficiently for both new fabrication and plant maintenance parts.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Mining equipment fabrication",
        clusters: ["Khasi Hills", "Jaintia Hills"],
        products: ["conveyor components", "material-handling parts", "equipment guards"],
        note: "Workshops serving coal and limestone extraction in the Khasi and Jaintia Hills fabricate conveyor and material-handling components where consistent plate cutting reduces rework compared with older gas-cutting methods.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Food processing equipment",
        clusters: ["Shillong"],
        products: ["processing line frames", "stainless steel fixtures"],
        note: "Equipment fabricators supplying fruit and spice processing units around Shillong need clean, accurate stainless steel cutting for hygienic fixtures and frames, a task well suited to a compact fiber laser.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: ["Byrnihat Industrial Area", "Barapani Industrial Estate"],
    logisticsNote: "Machines dispatched from Kolkata reach Byrnihat and Shillong by road via the Siliguri corridor and NH27 through Assam, with typical transit of 5-7 days given the distance, and the Byrnihat belt's proximity to Guwahati keeps onward road time short once the shipment clears Assam. Air freight from Kolkata to Guwahati, with a short road transfer to Shillong, covers urgent spares dispatch.",
    neighbouringStateSlugs: ["assam"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Meghalaya?", a: "Send us your material thickness, bed size requirement and production volume through our enquiry form. We will issue a formal quotation covering machine specification, ex-works Kolkata pricing and delivery timeline to your facility in Byrnihat, Shillong or elsewhere in Meghalaya." },
      { q: "How long does delivery and installation take from Kolkata to Meghalaya?", a: "Road transit from Kolkata to the Byrnihat belt or Shillong typically takes 5-7 days via the Siliguri corridor and Assam. Once the machine reaches site, our engineers carry out installation, calibration and commissioning, usually completed within a week of arrival." },
      { q: "Is on-site service and AMC coverage available in Meghalaya?", a: "Yes. Engineers are dispatched from our Kolkata headquarters for on-site service, breakdown support and annual maintenance contract visits across Meghalaya, including the Byrnihat industrial belt, supported by remote diagnostics for quicker first-response troubleshooting." },
      { q: "Can operators be trained locally in Meghalaya or must they travel to Kolkata?", a: "On-site operator training is provided at your Meghalaya facility during installation and commissioning, covering machine operation and routine maintenance. Teams wanting a more thorough session, including nesting software and advanced parameters, can send operators to our Kolkata training centre." },
      { q: "Which RA Machine model suits Meghalaya's cement and mining equipment industry?", a: "For fabrication supporting the Byrnihat cement belt and mining equipment work across the Khasi and Jaintia Hills, the RA-F3015 Pro fiber laser handles structural steel and equipment components efficiently, with the compact RA-F1530 suited to lighter stainless fixtures for food processing units." },
      { q: "What financing and interstate logistics considerations apply for buyers in Meghalaya?", a: "Purchases follow standard interstate GST invoicing. Given Meghalaya's proximity to Guwahati, onward road transit from Assam is relatively short once shipments clear the Siliguri corridor, and financing through your bank or NBFC partner can be arranged alongside the purchase order." },
    ],
  },
];
