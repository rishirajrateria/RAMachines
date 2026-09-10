/**
 * North India (part 2) state/UT data for the "laser cutting machines in <state>"
 * and "robotic welding in <state>" landing pages.
 *
 * To edit a state: update the matching object below directly.
 * To add a new state: see the `State` interface in data/types.ts for the
 * required shape, and data/india-index.ts for the canonical list of state/UT
 * slugs (use only those slugs in neighbouringStateSlugs). Keep facts real —
 * clusters, industrial estates and logistics corridors must be genuine,
 * named places.
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const north2States: State[] = [
  {
    slug: "delhi",
    name: "Delhi",
    type: "ut",
    tier: "large",
    region: "North",
    capital: "New Delhi",
    overview: [
      "Delhi anchors the National Capital Region, India's largest urban market, packed into a compact 1,483 sq km with a manufacturing base squeezed into equally compact industrial pockets. Wazirpur is north India's largest steel re-rolling and structural fabrication cluster, while Mayapuri runs one of the country's biggest auto-parts and reconditioning markets. Okhla and Naraina combine electronics assembly, garment machinery, and general engineering in dense multi-storey industrial complexes.",
      "Space constraints push most Delhi units toward compact-footprint machines rather than sprawling assembly lines, favouring precise, low-waste cutting over manual fabrication. The city's position on NH44 and NH48, its Eastern and Western Dedicated Freight Corridor connectivity, and IGI Airport's cargo terminal make it a natural distribution point for machines and spares moving further into Haryana, Uttar Pradesh, and Punjab.",
    ],
    industries: [
      {
        name: "Auto components",
        clusters: ["Wazirpur", "Mayapuri"],
        products: ["chassis brackets", "reconditioned auto body panels", "structural steel components"],
        note: "Mayapuri's auto-parts and reconditioning trade depends on accurate replacement panel and bracket cutting, while Wazirpur's fabricators supply structural steel components feeding the same supply chain.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Electrical & electronics",
        clusters: ["Okhla", "Naraina"],
        products: ["control panel enclosures", "switchgear boxes", "cabinet frames"],
        note: "Electronics and panel assemblers in Okhla and Naraina need clean, burr-free thin-sheet cutting to keep enclosure tolerances tight for electrical fitment.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Metal fabrication & hardware",
        clusters: ["Wazirpur steel market"],
        products: ["steel gates", "grills", "furniture", "structural brackets"],
        note: "Wazirpur's steel market is north India's largest source of re-rolled and fabricated steel goods, where fiber laser cutting replaces slower gas and plasma cutting for everyday hardware production.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Garment machinery",
        clusters: ["Okhla"],
        products: ["machine frames", "spare parts", "cutting table components"],
        note: "Okhla's garment machinery workshops fabricate frames and spares for the capital's export garment units, where a compact fiber laser fits space-constrained multi-storey units better than older cutting methods.",
        recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
      },
    ],
    industrialAreas: [
      "Okhla Industrial Area",
      "Wazirpur Industrial Area",
      "Mayapuri Industrial Area",
      "Naraina Industrial Area",
      "Bawana Industrial Area",
      "Narela Industrial Area",
      "Patparganj Industrial Estate",
    ],
    logisticsNote:
      "Machines and spares travel from Kolkata to Delhi by road along NH19, the historic Grand Trunk Road corridor via Varanasi and Kanpur, typically taking 3-5 days depending on the destination industrial area, with the Eastern Dedicated Freight Corridor available for heavier rail consignments. Urgent spares and service engineers move on daily Kolkata-Delhi flights into IGI Airport's cargo terminal, reaching most sites within a day.",
    neighbouringStateSlugs: ["haryana", "uttar-pradesh"],
    faqs: [
      {
        q: "How do I get a quote for a laser cutting or robotic welding machine in Delhi?",
        a: "Share your material type, thickness range, and typical sheet or tube size with RA Machine's sales team, along with your Wazirpur, Mayapuri, or Okhla unit's power supply and floor space details. We recommend a model - typically a 1.5 kW or 3 kW fiber laser for Delhi's space-constrained units - and issue a formal quotation with delivery and installation timelines within a few working days.",
      },
      {
        q: "How long does delivery and installation take from Kolkata to Delhi?",
        a: "Standard fiber laser and CO2 machines typically reach Delhi in 3-5 days by road from our Kolkata facility, with installation and commissioning at your Wazirpur, Naraina, or Bawana unit completed within a further 2-4 days depending on site readiness, power connection, and foundation work. Urgent spare parts can be flown into IGI Airport's cargo terminal for faster turnaround.",
      },
      {
        q: "Is on-site service and AMC available for machines installed in Delhi?",
        a: "Yes. RA Machine dispatches service engineers from Kolkata for installation, breakdown support, and scheduled maintenance visits across Delhi's industrial areas, backed by remote diagnostics for faster first-response troubleshooting. Annual maintenance contracts cover preventive servicing, consumable checks, and priority engineer dispatch, keeping machines in Wazirpur, Mayapuri, and Okhla units running with minimal downtime between visits.",
      },
      {
        q: "Where can our operators be trained on a new machine?",
        a: "Operators can be trained on-site at your Delhi facility during commissioning, covering machine operation, nesting software, and routine maintenance, or at RA Machine's training centre in Kolkata for a more in-depth session before the machine is dispatched. Most Delhi customers in Wazirpur and Mayapuri opt for on-site training to minimise disruption to production schedules.",
      },
      {
        q: "Which RA Machine model suits Delhi's auto-parts and reconditioning trade in Mayapuri?",
        a: "The RA-F3015-PRO 3 kW fiber laser is the workhorse choice for Mayapuri's auto-parts and reconditioning units, handling everyday mild steel and stainless sheet for brackets and body panels efficiently. Units cutting mostly thin sheet for garment machinery or electronics enclosures in Okhla and Naraina often find the more compact RA-F1530 a better fit for their space and output.",
      },
      {
        q: "What should Delhi buyers know about GST and interstate logistics?",
        a: "Machines are invoiced with applicable GST, and buyers can claim input tax credit against their Delhi GST registration in the normal course of business. Since Kolkata and Delhi are in different states, interstate movement is documented with proper e-way bills and transport receipts; RA Machine's logistics team handles this paperwork so your Wazirpur or Naraina unit receives the machine with compliant documentation.",
      },
    ],
  },
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    type: "state",
    tier: "medium",
    region: "North",
    capital: "Shimla",
    overview: [
      "Himachal Pradesh's industrial economy concentrates in the Baddi-Barotiwala-Nalagarh belt near the Punjab and Haryana border, one of India's largest pharmaceutical manufacturing hubs, producing a significant share of the country's generic drugs and formulations. Parwanoo, just across the Haryana border on NH5, hosts light engineering and auto-ancillary units feeding the same pharma and FMCG supply chains. Kala Amb adds further pharma, chemical, and general engineering capacity.",
      "Hilly terrain limits large-format fabrication, so most units run compact machines suited to stainless process equipment, packaging machinery parts, and light engineering components rather than heavy structural steel. Baddi also carries a growing electronics assembly base. Demand centres on precise, space-efficient fiber laser cutting for pharma equipment fabricators and auto-ancillary suppliers who cannot afford production delays from outsourced cutting.",
    ],
    industries: [
      {
        name: "Pharmaceutical & process equipment",
        clusters: ["Baddi", "Nalagarh"],
        products: ["stainless process skids", "packaging machine frames", "equipment enclosures"],
        note: "Baddi's pharma manufacturers and their equipment fabricators need precise stainless steel cutting for process skids and packaging machinery, where a fiber laser avoids the heat distortion that slows down clean-room grade fabrication.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Light engineering & auto ancillaries",
        clusters: ["Baddi", "Parwanoo"],
        products: ["brackets", "machine frames", "auto ancillary parts"],
        note: "Auto-ancillary units around Baddi and Parwanoo supply mid-volume components where fiber laser cutting paired with robotic welding keeps weld quality consistent across production runs.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Electronics",
        clusters: ["Baddi"],
        products: ["enclosures", "panel boards"],
        note: "Baddi's electronics assemblers rely on clean thin-sheet cutting for enclosures and panel boards, where a compact fiber laser suits their smaller production floors.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: [
      "Baddi Industrial Area",
      "Barotiwala Industrial Area",
      "Nalagarh Industrial Area",
      "Parwanoo Industrial Area",
      "Kala Amb Industrial Area",
    ],
    logisticsNote:
      "Machines and spares travel from Kolkata to Himachal Pradesh by road via NH19 to Chandigarh and onward on NH5 into the Baddi-Barotiwala-Nalagarh belt and Parwanoo, typically 5-7 days depending on hill-road conditions near Kala Amb and Nalagarh. Chandigarh International Airport, roughly 60 km from Baddi, handles urgent spares and service-engineer travel with onward road transfer.",
    neighbouringStateSlugs: ["jammu-and-kashmir", "punjab", "haryana", "uttarakhand"],
    faqs: [
      {
        q: "How do I get a quote for a machine for my Baddi facility?",
        a: "Send RA Machine your material type, thickness range, and production volume details from your Baddi, Parwanoo, or Kala Amb unit, including your pharma or auto-ancillary end use. Our sales team recommends a suitable fiber laser or robotic welding cell and issues a formal quotation with delivery and installation timelines, typically within a few working days of receiving your requirements.",
      },
      {
        q: "How long does delivery and installation take from Kolkata to Himachal Pradesh?",
        a: "Machines typically reach the Baddi-Barotiwala-Nalagarh belt or Parwanoo in 5-7 days by road from Kolkata, accounting for hill-road conditions on the final stretch. Installation and commissioning at your facility usually take a further 2-4 days depending on site readiness, power supply, and foundation preparation for larger machines.",
      },
      {
        q: "Does RA Machine provide on-site service and AMC coverage in Himachal Pradesh?",
        a: "Yes. Service engineers are dispatched from Kolkata for installation, breakdown response, and scheduled visits to Baddi, Parwanoo, and Kala Amb units, supported by remote diagnostics for faster first-line troubleshooting. Annual maintenance contracts cover preventive servicing and consumable checks, with priority engineer dispatch scheduled around hill-road travel times.",
      },
      {
        q: "Where can our team be trained on the new machine?",
        a: "Training is available on-site at your Baddi or Parwanoo facility during commissioning, covering operation, nesting software, and routine upkeep, or at RA Machine's training centre in Kolkata for a more extensive session. Many pharma equipment fabricators prefer on-site training to keep clean-room-adjacent production schedules on track.",
      },
      {
        q: "Which RA Machine model suits Baddi's pharma equipment fabricators?",
        a: "The RA-F3015-PRO 3 kW fiber laser handles the stainless and mild steel process skids, packaging frames, and enclosures typical of Baddi's pharma equipment fabricators efficiently. Units working mostly with thinner gauge sheet for electronics enclosures or lighter engineering parts often find the RA-F1530 a better fit for their production volumes.",
      },
      {
        q: "What should Himachal Pradesh buyers know about GST and logistics?",
        a: "Machines are invoiced with applicable GST, and Himachal Pradesh buyers can claim input tax credit through their state GST registration in the usual course. Since the machine travels from West Bengal, interstate movement is documented with e-way bills and transport receipts, and buyers should build the 5-7 day hill-road transit time into their production planning.",
      },
    ],
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    type: "state",
    tier: "medium",
    region: "North",
    capital: "Dehradun",
    overview: [
      "Uttarakhand's plains industrial belt runs through Haridwar and Rudrapur (Pantnagar), built up as an auto-ancillary base feeding Tata Motors, Ashok Leyland, Bajaj, and other OEM plants located within or near the state. Haridwar also carries a substantial pharmaceutical manufacturing presence alongside its auto-component units. Roorkee, home to one of India's oldest engineering institutes, anchors a smaller but steady engineering goods and machine-building cluster.",
      "SIDCUL's estates at Haridwar and Rudrapur concentrate hundreds of ancillary units supplying sheet metal brackets, chassis components, and welded assemblies to nearby OEM lines, creating repeat, high-volume demand for precise cutting and welding. Dehradun and Selaqui add general engineering and light manufacturing capacity. Proximity to the Delhi-NCR ancillary belt via NH34 keeps the state closely tied into north India's automotive supply chain.",
    ],
    industries: [
      {
        name: "Auto components",
        clusters: ["Haridwar", "Rudrapur"],
        products: ["chassis brackets", "sheet metal sub-assemblies", "tube frames"],
        note: "Ancillary units in SIDCUL Haridwar and Rudrapur supply OEM lines with brackets and welded sub-assemblies, where fiber laser cutting and robotic MIG welding hold the tolerance and weld consistency OEM audits require.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6", "ra-t6000"],
      },
      {
        name: "Pharmaceutical equipment",
        clusters: ["Haridwar"],
        products: ["process skids", "equipment frames", "stainless enclosures"],
        note: "Haridwar's pharma manufacturing base needs the same precision stainless fabrication as its auto-ancillary neighbours, making a mid-power fiber laser a practical shared investment for job-diverse fabricators.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Engineering goods",
        clusters: ["Roorkee"],
        products: ["machine frames", "structural components", "spare parts"],
        note: "Roorkee's long-established engineering goods workshops fabricate machine frames and structural parts where in-house laser cutting shortens lead times against outsourced blanking.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
    ],
    industrialAreas: [
      "SIDCUL Industrial Area (Haridwar)",
      "SIDCUL Industrial Area (Rudrapur/Pantnagar)",
      "Roorkee Industrial Estate",
      "Selaqui Industrial Area (Dehradun)",
      "Kashipur Industrial Area",
    ],
    logisticsNote:
      "Machines and spares move from Kolkata to Uttarakhand by road via NH19 through Lucknow and Bareilly, then NH34 into Haridwar and Rudrapur, typically taking 4-6 days depending on the destination cluster. Rail freight to Haridwar and air freight for urgent spares via Dehradun's Jolly Grant Airport or Delhi with onward road transfer both remain available options.",
    neighbouringStateSlugs: ["himachal-pradesh", "uttar-pradesh", "haryana"],
    faqs: [
      {
        q: "How do I request a quote for a Uttarakhand facility?",
        a: "Share your material specifications, thickness range, and production volumes from your Haridwar, Rudrapur, or Roorkee unit with RA Machine's sales team, including any OEM tolerance requirements you work to. We recommend a suitable fiber laser or robotic welding cell and provide a formal quotation with delivery timelines within a few working days.",
      },
      {
        q: "How long does delivery take from Kolkata to Uttarakhand?",
        a: "Machines typically reach SIDCUL Haridwar or Rudrapur in 4-6 days by road from Kolkata via the NH19-NH34 corridor through Lucknow and Bareilly. Installation and commissioning at site generally take a further 2-3 days, and rail freight remains an option for larger or heavier machine consignments.",
      },
      {
        q: "Is on-site service and AMC coverage available in Uttarakhand?",
        a: "Yes. RA Machine dispatches service engineers from Kolkata for installation, repairs, and scheduled maintenance across Haridwar, Rudrapur, and Roorkee, supported by remote diagnostics for quicker troubleshooting between visits. Annual maintenance contracts include preventive servicing and consumable checks, with priority scheduling for OEM-linked ancillary units running tight production calendars.",
      },
      {
        q: "Where can operators be trained?",
        a: "Operators can be trained on-site at your SIDCUL Haridwar or Rudrapur facility during commissioning, or at RA Machine's training centre in Kolkata for a more comprehensive session covering nesting software and preventive maintenance. Most auto-ancillary units supplying OEM lines choose on-site training to avoid disrupting production schedules.",
      },
      {
        q: "Which RA Machine model suits Uttarakhand's auto-ancillary belt?",
        a: "The RA-F3015-PRO 3 kW fiber laser is the standard choice for Rudrapur and Haridwar ancillary units cutting brackets and sheet metal sub-assemblies for OEM lines, often paired with the RA-RW6 robotic welding cell for consistent weld quality. Units cutting structural tube for chassis components should consider the RA-T6000 tube laser instead.",
      },
      {
        q: "What should Uttarakhand buyers know about GST and interstate logistics?",
        a: "Machines are invoiced with applicable GST, and buyers can claim input tax credit against their Uttarakhand GST registration as usual. Since the machine ships from West Bengal, interstate transport is documented with e-way bills and standard freight receipts, and OEM-linked ancillary units should factor the 4-6 day road transit into their supply commitments.",
      },
    ],
  },
  {
    slug: "jammu-and-kashmir",
    name: "Jammu and Kashmir",
    type: "ut",
    tier: "medium",
    region: "North",
    capital: "Srinagar / Jammu",
    overview: [
      "Jammu and Kashmir's industrial base splits between the Jammu region's plains-based manufacturing and Srinagar's traditional handicraft economy. Bari Brahmana, on the outskirts of Jammu, anchors the union territory's largest industrial estate, hosting light engineering, auto-ancillary, and general fabrication units. Samba and Kathua, further along NH44 toward Punjab, carry a growing food-processing equipment and agro-based manufacturing base drawing on the region's horticulture and dairy output.",
      "Srinagar's economy still centres on handicrafts and handloom products, where workshops increasingly need machine-made components and jigs rather than fully manual tooling. Lassipora in Pulwama adds further light industrial capacity in the valley. Year-round road access to the Jammu region, unlike the higher passes further north, supports steady demand for fabrication and cutting equipment across these clusters.",
    ],
    industries: [
      {
        name: "Handicrafts & handloom machinery",
        clusters: ["Srinagar"],
        products: ["loom frames", "jigs", "tool fixtures"],
        note: "Srinagar's handicraft and handloom workshops are shifting toward machine-cut jigs and fixtures for consistency, where a compact fiber or CO2 laser handles thin sheet and non-metal components alongside traditional handwork.",
        recommendedProductSlugs: ["ra-c1390", "ra-f1530"],
      },
      {
        name: "Light engineering & fabrication",
        clusters: ["Jammu", "Bari Brahmana"],
        products: ["structural brackets", "machine frames", "welded assemblies"],
        note: "Bari Brahmana's light engineering units supply general fabrication and welded assemblies where fiber laser cutting paired with robotic welding improves throughput on repeat orders.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-rw6"],
      },
      {
        name: "Food processing equipment",
        clusters: ["Samba", "Kathua"],
        products: ["stainless process equipment", "conveyor frames", "storage structures"],
        note: "Food-processing equipment fabricators around Samba and Kathua need clean stainless cutting for hygienic process equipment feeding the region's horticulture and dairy processing units.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
    ],
    industrialAreas: [
      "Bari Brahmana Industrial Estate (Jammu)",
      "Samba Industrial Growth Centre",
      "Kathua Industrial Estate",
      "Lassipora Industrial Estate (Pulwama)",
    ],
    logisticsNote:
      "Machines and spares travel from Kolkata to the Jammu region by road via NH19 and NH44 through Delhi, typically taking 5-7 days to reach Bari Brahmana, Samba, or Kathua. Onward movement to Srinagar and the valley clusters adds further transit time and can be affected by winter closures on the Jawahar Tunnel route, so deliveries to Kashmir valley units are best planned outside the peak winter months.",
    neighbouringStateSlugs: ["himachal-pradesh", "punjab", "ladakh"],
    faqs: [
      {
        q: "How do I get a quote for a machine for my Jammu region facility?",
        a: "Share your material type, thickness range, and production details from your Bari Brahmana, Samba, or Kathua unit with RA Machine's sales team. We recommend a suitable fiber laser, CO2 laser, or robotic welding cell based on your product mix and issue a formal quotation with a realistic delivery timeline within a few working days.",
      },
      {
        q: "How long does delivery take from Kolkata to Jammu and Kashmir?",
        a: "Machines typically reach Bari Brahmana, Samba, or Kathua in 5-7 days by road from Kolkata via Delhi on NH19 and NH44. Deliveries onward to Srinagar and valley clusters take longer and should avoid the winter months when the Jawahar Tunnel route can face closures.",
      },
      {
        q: "Is on-site service and AMC coverage available across Jammu and Kashmir?",
        a: "Yes. RA Machine dispatches service engineers from Kolkata for installation and scheduled maintenance across Bari Brahmana, Samba, Kathua, and Srinagar-area units, supported by remote diagnostics for faster first-response troubleshooting. Annual maintenance contracts account for seasonal road conditions when scheduling visits to valley locations.",
      },
      {
        q: "Where can operators be trained?",
        a: "Training is provided on-site during installation at your Jammu region or Srinagar facility, covering machine operation and routine maintenance, or at RA Machine's training centre in Kolkata for a more thorough session. Many Bari Brahmana light engineering units opt for on-site training to keep production running.",
      },
      {
        q: "Which RA Machine model suits Bari Brahmana's light engineering units?",
        a: "The RA-F3015-PRO 3 kW fiber laser handles the general fabrication and welded assembly work typical of Bari Brahmana, usually paired with the RA-RW6 robotic welding cell. Srinagar's handicraft and handloom workshops working with thinner sheet and non-metal materials are often better served by the RA-C1390 CO2 laser.",
      },
      {
        q: "What should Jammu and Kashmir buyers know about GST and logistics?",
        a: "Machines are invoiced with applicable GST, and buyers can claim input tax credit through their Jammu and Kashmir GST registration in the usual course. Since the machine ships from West Bengal, interstate movement is documented with e-way bills, and buyers in Srinagar and the valley should plan purchase timing around the winter road-closure risk on the Jawahar Tunnel route.",
      },
    ],
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    type: "ut",
    tier: "small",
    region: "North",
    capital: "Chandigarh",
    overview: [
      "Chandigarh, a compact union territory shared administratively as the capital of both Punjab and Haryana, sits at the centre of a dense tri-city industrial belt that also draws in Panchkula and Mohali. Its own industrial base is small but precise, built on light engineering, hand tools, and electrical goods manufacturing rather than heavy fabrication.",
      "Chandigarh Industrial Area's two phases host precision component makers and electrical goods manufacturers who feed into the wider Punjab and Haryana supply chains rather than serving the union territory's own limited market alone. Proximity to Ludhiana's hand-tool and auto-parts industry and Mohali's engineering base means Chandigarh-based fabricators often compete on precision and turnaround for smaller-batch, tighter-tolerance work rather than volume.",
    ],
    industries: [
      {
        name: "Precision engineering & auto ancillaries",
        clusters: ["Chandigarh", "Panchkula"],
        products: ["precision brackets", "small machined-and-cut components", "auto ancillary parts"],
        note: "Precision engineering units in Chandigarh Industrial Area supply tight-tolerance components where fiber laser cutting reduces secondary finishing compared to conventional methods.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Electrical goods",
        clusters: ["Chandigarh"],
        products: ["switchgear panels", "control boxes"],
        note: "Electrical goods manufacturers need clean thin-sheet cutting for switchgear enclosures, where a compact fiber laser fits Chandigarh's smaller industrial plots.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Hand tools",
        clusters: ["Chandigarh"],
        products: ["tool bodies", "fixtures"],
        note: "Hand tool makers benefit from precise blanking of tool bodies and fixtures, complementing the nearby Ludhiana hand-tool cluster's larger volume production.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
    ],
    industrialAreas: ["Chandigarh Industrial Area Phase I", "Chandigarh Industrial Area Phase II"],
    logisticsNote:
      "Machines and spares travel from Kolkata to Chandigarh by road via NH19 through Delhi and onward on NH44, typically taking 4-5 days. Chandigarh International Airport provides a fast air-freight option for urgent spares and service-engineer travel, usually reaching site within a day of dispatch from Kolkata.",
    neighbouringStateSlugs: ["punjab", "haryana"],
    faqs: [
      {
        q: "How do I get a quote for a Chandigarh facility?",
        a: "Share your material type, thickness range, and production volumes from your Chandigarh Industrial Area unit with RA Machine's sales team, along with details of your precision engineering, electrical goods, or hand tool product line. We recommend a suitable fiber laser and issue a formal quotation with delivery timelines within a few working days.",
      },
      {
        q: "How long does delivery take from Kolkata to Chandigarh?",
        a: "Machines typically reach Chandigarh Industrial Area in 4-5 days by road from Kolkata via Delhi on NH19 and NH44. Installation and commissioning generally take a further 2-3 days, and Chandigarh International Airport offers a fast option for urgent spare parts.",
      },
      {
        q: "Is on-site service and AMC coverage available in Chandigarh?",
        a: "Yes. RA Machine dispatches service engineers from Kolkata for installation, repairs, and scheduled maintenance visits to Chandigarh Industrial Area units, backed by remote diagnostics for faster troubleshooting between visits. Annual maintenance contracts cover preventive servicing, consumable checks, and priority engineer dispatch for Chandigarh customers.",
      },
      {
        q: "Where can operators be trained?",
        a: "Operators can be trained on-site at your Chandigarh facility during commissioning, covering operation, nesting software, and routine maintenance, or at RA Machine's training centre in Kolkata for a more detailed session. Most precision engineering units in Chandigarh Industrial Area choose on-site training to keep tight-tolerance production schedules on track.",
      },
      {
        q: "Which RA Machine model suits Chandigarh's precision engineering units?",
        a: "The RA-F1530 1.5 kW fiber laser suits most Chandigarh Industrial Area units cutting thinner-gauge precision components, switchgear enclosures, and hand tool bodies. Units handling heavier-gauge auto-ancillary or structural work alongside their precision line often add the RA-F3015-PRO for broader thickness coverage.",
      },
      {
        q: "What should Chandigarh buyers know about GST and interstate logistics?",
        a: "Machines are invoiced with applicable GST, and Chandigarh buyers can claim input tax credit through their union territory GST registration as usual. Since the machine ships from West Bengal, interstate movement is documented with e-way bills and standard transport receipts, and the 4-5 day road transit should be factored into installation planning.",
      },
    ],
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    type: "ut",
    tier: "small",
    region: "North",
    capital: "Leh",
    overview: [
      "Ladakh's industrial base is genuinely small, shaped by its high-altitude terrain, sparse population, and short working season rather than any manufacturing cluster in the conventional sense. Most fabrication work in and around Leh supports ongoing infrastructure, construction, and defence-related logistics rather than product manufacturing for outside markets.",
      "Small workshops fabricate structural steel, gates, grills, and vehicle and equipment repair parts for local contractors, the Border Roads Organisation's supporting works, and defence establishments. Formal industrial infrastructure beyond the Choglamsar estate near Leh remains minimal. Demand for cutting and welding equipment here is modest and steady rather than volume-driven, tied closely to Ladakh's ongoing infrastructure build-out.",
    ],
    industries: [
      {
        name: "Construction & infrastructure fabrication",
        clusters: ["Leh", "Choglamsar"],
        products: ["structural brackets", "gates and grills", "support frames"],
        note: "Infrastructure and construction-support fabricators around Leh need compact, reliable cutting equipment that can run through the short working season without depending on cutting work sent outside the region.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Defence-support & logistics fabrication",
        clusters: ["Leh"],
        products: ["vehicle repair parts", "equipment brackets", "storage structures"],
        note: "Workshops supporting defence logistics and vehicle upkeep around Leh benefit from robotic welding consistency for repair and support fabrication where manual welding quality varies with altitude and cold conditions.",
        recommendedProductSlugs: ["ra-rw6", "ra-f1530"],
      },
    ],
    industrialAreas: ["Choglamsar Industrial Estate (Leh)"],
    logisticsNote:
      "Road access to Ladakh is seasonal: the Srinagar-Leh and Manali-Leh highways typically close from around November to April, so machine and spare-parts delivery from Kolkata must be planned around this window, with road transit taking roughly 8-10 days during the open season via Delhi and Manali or Jammu and Srinagar. Outside the road season, air freight into Leh's Kushok Bakula Rimpochee Airport is the only reliable route for urgent parts and engineer travel.",
    neighbouringStateSlugs: ["jammu-and-kashmir", "himachal-pradesh"],
    faqs: [
      {
        q: "How do I get a quote for a machine to be used in Leh or Ladakh?",
        a: "Share your typical material, thickness, and the type of infrastructure or repair fabrication work you handle with RA Machine's sales team. Given Ladakh's small scale and seasonal access, we recommend planning your purchase well ahead of the road-transport season and will issue a quotation along with a realistic delivery window based on current road conditions.",
      },
      {
        q: "How long does delivery take to Ladakh from Kolkata?",
        a: "During the open road season, roughly May to October, transit from Kolkata to Leh typically takes 8-10 days via Delhi and Manali or Jammu and Srinagar. Outside this window, the Manali-Leh and Srinagar-Leh highways are closed, so delivery depends on air freight into Leh, which is slower and more limited by cargo capacity, so early planning matters.",
      },
      {
        q: "Is on-site service available in Leh, and how does an AMC work here?",
        a: "RA Machine dispatches service engineers from Kolkata for installation and major service visits, timed around the road-open season where possible, backed by remote diagnostics for day-to-day troubleshooting year-round. An annual maintenance contract for Ladakh factors in the seasonal access window, scheduling preventive visits during the months when road or air travel is reliable.",
      },
      {
        q: "Can operators in Leh be trained on the machine?",
        a: "Yes. On-site training is provided during installation and commissioning, covering safe operation, basic maintenance, and troubleshooting suited to Ladakh's limited local technical support. Operators who prefer a more thorough session, or who are being trained ahead of the machine's seasonal delivery, can also attend RA Machine's training centre in Kolkata.",
      },
      {
        q: "Which RA Machine model suits Ladakh's infrastructure and defence-support fabrication?",
        a: "The compact RA-F1530 fiber laser suits most Leh-area workshops cutting structural brackets, gates, and repair parts at modest volumes, while the RA-RW6 robotic welding cell helps maintain consistent weld quality for vehicle and equipment repair work where cold conditions make manual welding less reliable.",
      },
      {
        q: "What should Ladakh buyers know about GST and getting the machine delivered?",
        a: "Machines are invoiced with applicable GST for delivery to Ladakh, and interstate movement from West Bengal is documented with standard e-way bills and transport receipts. Because road access is seasonal, buyers should factor transport lead time into financing and delivery planning rather than assuming year-round despatch, and coordinate purchase timing with the road-open season wherever possible.",
      },
    ],
  },
];
