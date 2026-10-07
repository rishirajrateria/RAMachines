/**
 * data/guides/importing-cnc-machines-from-india.ts — buyer guide for
 * customers outside India: Incoterms, payment, documents, conformity marking,
 * receiving the crate and installation. RA-specific claims are limited to the
 * confirmed commercial and service facts; everything else is general practice.
 */
import type { Guide } from "../types";

export const guide: Guide = {
  slug: "importing-cnc-machines-from-india",
  title: "Importing a CNC Machine from India: Shipping and Documents",
  description:
    "How to import a CNC cutting or welding machine from India: FOB or CIF, payment, shipping documents, conformity marking, customs and installation.",
  h1: "Importing a CNC Machine from India: Shipping, Documents and Installation",
  summary:
    "Importing a CNC machine from India comes down to five things: agree the Incoterm (usually FOB an Indian port or CIF your nearest port), pay against clear milestones, check the machine on a pre-shipment video, receive a complete document set for your customs broker, and plan installation before the crate lands. Confirm your voltage and conformity marking requirements at quotation, not at the port.",
  sections: [
    {
      h2: "What does importing a CNC machine from India involve?",
      paragraphs: [
        "Buying a machine from another country is not much harder than buying locally, but more of the work happens before the machine exists. The specification, electrical supply, conformity marking, shipping terms and installation plan all need to be agreed at the quotation stage, because changing any of them once the machine is built or crated costs time and money.",
        "The usual sequence is quotation, proforma invoice, advance payment, production, factory testing, pre-shipment inspection, balance payment, export packing, sea freight, customs clearance in your country, delivery to site, then installation and training. On your side, you need an importer of record (normally your company), a customs broker or clearing agent, and someone who will own site preparation while the machine is being built.",
      ],
    },
    {
      h2: "FOB or CIF: which Incoterm should you choose?",
      paragraphs: [
        "Incoterms are the international rules that say who pays for what and where risk passes from seller to buyer. The two you will meet most often for machinery from India are FOB and CIF.",
        "Under FOB (Free On Board), the seller clears the machine for export and loads it onto the vessel at the named Indian port. Risk passes to you once it is on board, and you arrange and pay for ocean freight and insurance through your own forwarder. Under CIF (Cost, Insurance and Freight), the seller books and pays for freight and minimum insurance to your named port. Risk still passes at loading in India, and you pay destination charges, duties, customs clearance and inland transport.",
        "FOB suits buyers who already ship regularly and have a forwarder with good rates. CIF is simpler if this is your first import, but check what the insurance covers, because the minimum cover under CIF is limited and many buyers top it up.",
      ],
      bullets: [
        "Who books the vessel, and which port of discharge is quoted?",
        "Will the machine travel in a standard container, a high-cube or an open-top or flat-rack unit?",
        "What insurance cover applies, and from which point?",
        "Which destination charges will your forwarder or broker bill you for?",
      ],
    },
    {
      h2: "Paying safely and checking the machine before it ships",
      paragraphs: [
        "Export payment for capital equipment is normally split between an advance with the order and a balance before shipment. Before paying the advance, make sure the proforma invoice states the full specification: source power or welding current, working area, control and software, supply voltage and frequency, accessories, any spares kit, crating, the Incoterm and port, and what installation and training include.",
        "The pre-shipment inspection is your last chance to see the machine before you pay the balance. A live video call is more useful than photographs, because you can ask for exactly what you want to see.",
      ],
      bullets: [
        "Ask for a test cut or weld on your own material and thickness, not a demonstration part.",
        "Watch every axis move through its full travel and check the controller boots cleanly.",
        "Read the rating plate: voltage, frequency and phase should match your site.",
        "Check serial numbers of major components against the packing list.",
        "Confirm the software language and the licences supplied.",
      ],
    },
    {
      h2: "Which shipping documents will you receive?",
      paragraphs: [
        "Your customs broker will ask for four core documents. The commercial invoice states the value and description of the goods and is the basis for assessing duty. The packing list gives the contents, weight and dimensions of each crate. The bill of lading is the carrier's receipt for the cargo and, in its original form, the document of title you or your agent present to collect the machine; many shipments now use a telex release or sea waybill instead of paper originals, so agree this early. The certificate of origin shows the machine was made in India, which matters if your country has a trade agreement with India that offers a lower duty rate.",
        "Ask your broker to confirm the tariff classification and duty rate before the machine ships, not after it arrives. As a general guide, laser and plasma cutting machines usually fall under HS heading 8456 and electric welding machines under 8515, but the final classification is for your broker and your customs authority to decide.",
      ],
    },
    {
      h2: "Conformity marking, voltage and local rules",
      paragraphs: [
        "Each destination market sets its own conformity requirements for industrial machinery. The European Union expects CE marking, the United Kingdom expects UKCA marking, and Saudi Arabia runs its own SASO conformity scheme with shipment certificates issued through the SABER platform. Other markets have different schemes, or none for this class of equipment. Find out what applies before you order, because it can affect guarding, electrical design, documentation and labelling.",
        "Electrical supply varies too. Three-phase supplies differ from country to country in voltage and in frequency, which is either 50 Hz or 60 Hz, and frequency affects motors, pumps and chillers as well as the power source. Give your supplier the actual figures from your site, ideally measured by your electrician, rather than the nominal national standard.",
      ],
    },
    {
      h2: "Receiving the crate and planning installation",
      paragraphs: [
        "Before the vessel arrives, confirm how the crate will be unloaded at your site and whether a crane or forklift of the right capacity will be there. Check door widths, headroom and the route from the unloading point to the machine's final position, using the crate dimensions on the packing list.",
        "Inspect the crate before you sign the delivery receipt. If it is damaged, photograph it, note the damage on the receipt and tell your insurer and the seller the same day. Keep the machine crated, dry and covered until the installation date, and have the site ready, with power, earthing, compressed air and gas in place, before the engineer arrives.",
      ],
    },
    {
      h2: "How RA Machine handles export orders",
      paragraphs: [
        "RA Machine is the CNC machine division of R.A. Auto Engineering Works in Kolkata, which holds an Import Export Code from the DGFT. Export orders are usually quoted and invoiced in US dollars, FOB Kolkata or Delhi, or CIF to your nearest port. Payment is 70% advance with the order and 30% before shipment, and lead time is 8 to 10 weeks.",
        "Every export machine gets a pre-shipment video inspection, seaworthy crating, and a commercial invoice, packing list, bill of lading and certificate of origin. We confirm what your market requires, and what we can supply for it, at the quotation stage before production begins. Installation, commissioning and operator training are included; visits outside India are subject to visa and travel arrangements. Warranty is 12 months, with extended cover on request, remote diagnostics respond within 4 working hours, and spares are shipped by air courier.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is FOB or CIF better when buying a machine from India?",
      a: "Neither is better in every case. FOB gives you control of freight and insurance through your own forwarder, which suits regular importers. CIF means the seller books freight and basic insurance to your port, which is simpler for a first import. Under both terms, risk passes once the machine is loaded in India, so check your insurance cover either way.",
    },
    {
      q: "Who pays import duty and customs clearance in my country?",
      a: "Under FOB or CIF terms, you as the importer pay import duty, local taxes, port and terminal charges at destination, customs clearance and inland transport to your site. Your customs broker can estimate these once they have the commercial invoice value and agree the tariff classification, so ask for that estimate before you confirm the order rather than after the vessel sails.",
    },
    {
      q: "Do I need a customs broker to import a CNC machine?",
      a: "In most countries, yes in practice. A CNC machine is a high-value commercial import that needs a formal customs entry, the correct tariff classification and payment of duty and taxes before release. A licensed broker or clearing agent handles this for a fee and knows the local rules. Many freight forwarders offer brokerage too, which keeps shipping and clearance with one contact.",
    },
    {
      q: "Will a machine built in India work on my factory's power supply?",
      a: "It will if the supply is specified correctly before production. Give the supplier your site's three-phase voltage, frequency and available capacity, measured by your electrician where possible. The power source, motors, chiller and controls are then built or configured to match, with a transformer where needed. Getting this right at quotation avoids expensive modifications after the machine arrives.",
    },
    {
      q: "What should I do if the crate arrives damaged?",
      a: "Do not sign a clean delivery receipt. Photograph the crate and any visible damage, write a clear note on the receipt, and inform your insurer, freight forwarder and the seller the same day. Avoid unpacking further than needed to record the damage until the insurer agrees, because claims are often time-limited and depend on prompt, documented notice.",
    },
  ],
  families: [
    "fiber-laser-cutting-machines",
    "cnc-plasma-cutting-machines",
    "submerged-arc-welding-machines",
  ],
  related: [
    "preparing-factory-for-cnc-machine",
    "cnc-machine-buying-checklist",
    "welding-machine-220v-vs-440v",
  ],
  published: "2026-10-07",
  updated: "2026-10-07",
};
