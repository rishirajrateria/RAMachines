/** data/cities/chandigarh-ladakh.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  // ---- Chandigarh ----
  {
    slug: "chandigarh",
    name: "Chandigarh",
    stateSlug: "chandigarh",
    overview: [
      "Chandigarh, India's first planned post-independence city, set aside dedicated Industrial Area Phase I and Phase II zones alongside its residential sectors, and these have grown into a base for engineering goods and auto components.",
      "Precision manufacturing has since become a hallmark of the city's industry, and a growing IT and electronics presence has added further demand for enclosures, panels and small-batch metal parts among local fabricators.",
    ],
    industries: ["engineering goods manufacturing", "auto components manufacturing", "precision manufacturing", "electronics enclosure fabrication"],
    industrialAreas: ["Chandigarh Industrial Area Phase I", "Chandigarh Industrial Area Phase II"],
    recommendedFamilies: ["fiber-laser-cutting-machines", "robotic-welding-systems", "mig-tig-arc-welding-machines"],
    nearbyCitySlugs: [],
    logisticsNote: "Chandigarh is about 1,650 km from our Kolkata headquarters via NH19, and machines typically reach site and are commissioned within 5–7 working days.",
    faqs: [
      { q: "How can a Chandigarh Industrial Area unit get a quote and see a machine demonstration?", a: "Share your engineering goods or auto component drawings, material thickness and typical volumes through our enquiry form or WhatsApp. Our Kolkata team will recommend a suitable RA Machine and share a quotation, and Chandigarh Industrial Area Phase I or II buyers can request a video demonstration or an in-person trial before ordering." },
      { q: "What is the delivery and installation timeline for a machine ordered from Chandigarh?", a: "Dispatch from Kolkata to Chandigarh typically takes 5–7 working days by road via NH19. Our engineers travel to your Industrial Area unit afterward to complete installation, electrical connection and commissioning, checking cut quality on your precision or auto-component parts before formal handover." },
      { q: "How quickly can repairs or service visits reach a Chandigarh unit?", a: "Most control and software issues are diagnosed remotely within about 4 working hours of your call. Where a physical visit is required, engineers are dispatched from our Kolkata headquarters to Chandigarh Industrial Area, with on-site attendance targeted within 48 hours for machines under warranty." },
      { q: "Can operators at a Chandigarh precision manufacturing unit be trained on the new machine?", a: "Yes, operator training is included with every Chandigarh installation, covering nesting for precision and auto-component parts, cutting parameter selection and routine maintenance. Given the tight tolerances common in the city's precision manufacturing base, training also covers accuracy checks and calibration routines." },
      { q: "Which RA Machine suits Chandigarh's engineering, auto-component and electronics base best?", a: "Chandigarh's engineering goods, precision parts and electronics enclosures are a natural fit for a CNC fiber laser cutting machine, which holds its accuracy across mixed small batches. Auto-component makers welding the same brackets and assemblies repeatedly can add a cobot or robotic welding system, while MIG and TIG welding machines cover the varied fabrication and enclosure assembly done across Industrial Area Phase I and II." },
    ],
  },
  // ---- Ladakh ----
  {
    slug: "leh",
    name: "Leh",
    stateSlug: "ladakh",
    overview: [
      "Leh sits at over 3,500 metres in the high-altitude Ladakh region, where tourism and government administration, not manufacturing, drive the local economy for most of the year.",
      "Local metalworking is limited to small fabrication and construction-linked jobs such as gates, railings and building supports, so this remains a low-volume, logistics-constrained market rather than an industrial cluster, and buyers here should plan around the region's short road-open season.",
    ],
    industries: ["tourism and hospitality-linked services", "government and administrative activity", "small-scale construction-linked metal fabrication"],
    industrialAreas: ["district industrial centre"],
    recommendedFamilies: ["mig-tig-arc-welding-machines"],
    nearbyCitySlugs: [],
    logisticsNote: "The Srinagar-Leh and Manali-Leh highways are typically snow-closed from around November to May, so deliveries to Leh are timed to the May-October road-open window or, for urgent spares, routed by air freight; expect a season-dependent window of roughly 10–15 working days from our Kolkata headquarters.",
    faqs: [
      { q: "How can a Leh workshop get a quote and see a machine demonstration given the small local market?", a: "Share your typical job sizes and materials, mostly construction-linked gates, railings and supports, through our enquiry form or WhatsApp. Our Kolkata team will recommend a compact, easy-to-operate machine sized to Leh's low-volume market and share a quotation, with a video demonstration available before you order." },
      { q: "What is the delivery and installation timeline for a machine ordered from Leh, given the mountain roads?", a: "Because the Srinagar-Leh and Manali-Leh highways are snow-closed for much of the year, roughly November to May, deliveries are timed to the May-October road-open window, or urgent spares can be sent by air freight. Plan for a season-dependent transit window of roughly 10–15 working days from Kolkata." },
      { q: "How quickly can repairs or service visits reach a Leh workshop?", a: "Remote diagnostics by phone or video call handle most control issues within about 4 working hours, regardless of season. Where an on-site visit is unavoidable, engineers are dispatched from Kolkata, but given Leh's altitude and seasonal road closures, in-person visits are best planned within the May-October window." },
      { q: "Can operators at a Leh fabrication unit be trained on the new machine?", a: "Yes, operator training is included at commissioning, covering safe start-up, basic welding parameters and maintenance suited to a small Leh workshop handling construction-linked gates, railings and supports. Remote video support continues afterward for day-to-day questions, which is especially useful outside the road-open season." },
      { q: "Which RA Machine suits Leh's tourism-led, low-volume market best?", a: "Given Leh's small scale and seasonal logistics, a MIG, TIG or MMA welding machine is the practical choice for the gates, railings and building supports that make up most local metalwork, and it is far easier to ship and install than a production cutting line. MMA copes especially well with outdoor site work, and the machine can be specified for a 220 V or 440 V supply." },
    ],
  },
];
