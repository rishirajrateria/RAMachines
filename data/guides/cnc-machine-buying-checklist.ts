/**
 * data/guides/cnc-machine-buying-checklist.ts — buyer guide: twelve questions
 * to put to any supplier before ordering a CNC cutting or welding machine.
 * The questions are numbered across the bullets of sections 1–5; the closing
 * section answers them with RA Machine's confirmed terms only.
 */
import type { Guide } from "../types";

export const guide: Guide = {
  slug: "cnc-machine-buying-checklist",
  title: "CNC Machine Buying Checklist: 12 Questions Before You Order",
  description:
    "Twelve questions to ask before ordering a CNC laser, plasma or welding machine, from material and power to price inclusions, warranty and service.",
  h1: "CNC Machine Buying Checklist: 12 Questions to Ask Before You Order",
  summary:
    "Before ordering a CNC cutting or welding machine, get written answers on twelve points: the materials and thicknesses it must handle, the power or current needed, working size, your power supply, gases and consumables, software, what the price includes, lead time, payment terms, installation and training, warranty, and service response. A supplier who answers all twelve in writing is easier to hold to account.",
  sections: [
    {
      h2: "Start with the job, not the machine",
      paragraphs: [
        "The most common buying mistake is choosing a machine from a brochure and then finding work for it. Start instead with the parts you make today and the work you expect to win over the next few years. Write it down: materials, thicknesses, part sizes, quantities and the finish your customers expect. Every supplier you speak to should get the same brief, so their quotations can be compared fairly.",
      ],
      bullets: [
        "1. What materials and thicknesses must the machine handle, and in what proportion? Size it for the thickness you cut or weld every week, not the job you see twice a year.",
        "2. What laser power, plasma current, welding process or current does that work need, and why has the supplier recommended that figure rather than the next one up or down?",
        "3. What sheet, plate, workpiece or seam size must the machine take, now and as your work grows?",
      ],
    },
    {
      h2: "Will the machine run properly in your factory?",
      paragraphs: [
        "A well-chosen machine still disappoints if the site cannot support it. Utilities and running costs are where many buyers get surprised after installation, so ask about them before you order and check the answers against your own electricity and gas bills.",
      ],
      bullets: [
        "4. What power supply does the machine need, in voltage, phase, frequency and load, and does that match what your site actually delivers? Will it need a stabiliser or transformer?",
        "5. Which gases, compressed air, consumables and utilities does it use, such as a chiller or fume extraction, and roughly what will they cost per shift at your expected output?",
      ],
    },
    {
      h2: "What exactly is in the price?",
      paragraphs: [
        "Two quotations with similar totals can describe very different machines. One may include the chiller, extraction, stabiliser, software and installation; another may list them as extras or leave them out entirely. Ask for an itemised quotation and put the inclusions side by side before comparing prices. If you are importing, also check the Incoterm, because a price that ends at the seller's port leaves freight, insurance, duty and clearance for you to add.",
      ],
      bullets: [
        "6. What is included, item by item: the machine, chiller, extraction, compressor or dryer, stabiliser, spares kit, packing, freight, insurance, installation, training and taxes?",
        "7. Which software is supplied for programming, nesting or weld paths, is it fully licensed to you, and what does an update or an extra seat cost?",
      ],
    },
    {
      h2: "Timeline and payment terms",
      paragraphs: [
        "Lead time affects when the machine starts paying for itself, and payment terms decide how much of your money is with the supplier before you see anything. Both should be in writing, with the milestones clearly defined.",
        "Work backwards from the date you need the machine running. Add the time for site preparation, delivery, installation and training to the supplier's lead time, and check that any order you are buying the machine for can wait that long. Then look at how payment lines up with progress. Terms that hold back part of the price until the machine is installed or inspected give you some leverage if something goes wrong; terms that ask for everything up front give you none.",
      ],
      bullets: [
        "8. What is the lead time from confirmed order to dispatch, and what happens if it slips?",
        "9. What are the payment milestones, what triggers each one, and in which currency will you be invoiced?",
      ],
    },
    {
      h2: "Installation, warranty and support after the sale",
      paragraphs: [
        "A CNC machine is a ten-year or longer relationship with its maker. The quality of installation, training and service often matters more to your output than small differences in specification, so give these questions as much weight as the machine itself.",
      ],
      bullets: [
        "10. Who installs and commissions the machine, how many days of operator training are included, and where is that training delivered?",
        "11. What does the warranty cover, for how long, from which date, and what is excluded?",
        "12. How quickly does the supplier respond to a breakdown, remotely and on site, where are spares held, and how are they shipped to you?",
      ],
    },
    {
      h2: "Comparing quotations and spotting warning signs",
      paragraphs: [
        "Once you have answers, lay the quotations out in a simple table: one row per question, one column per supplier. Gaps in the table tell you as much as the figures do. A supplier who cannot answer a question in writing before the order is unlikely to answer it more clearly after you have paid.",
        "Ask to see the machine cut or weld your own material, either at the supplier's works or on a live video call, before you place the order or before you pay the balance. For imports, also ask what conformity marking your country requires and whether the supplier can provide it.",
      ],
      bullets: [
        "Performance quoted only as up to figures, with no material or thickness stated",
        "Software, chiller or extraction missing from the quotation without explanation",
        "Warranty terms given verbally but not written into the quotation",
        "No clear answer on who services the machine or where spares come from",
        "Pressure to pay in full before any inspection",
      ],
    },
    {
      h2: "How RA Machine answers these questions",
      paragraphs: [
        "RA Machine builds five families of machine in Kolkata: CNC fiber laser cutting from 1.5 kW to 30 kW, CNC plasma cutting from 100 A to 200 A for a 2 mm to 25 mm cutting range, MIG, TIG and MMA welding at 220 V or 440 V, submerged arc welding at 440 V, and cobot or robotic welding cells. There are no model numbers; each machine is configured to the buyer's job and quoted with that configuration written out.",
        "Lead time is 8 to 10 weeks. In India, payment is 30% with the order, 60% before shipment and 10% after installation; export orders are 70% advance and 30% before shipment, usually in US dollars, with a pre-shipment video inspection. Installation, commissioning and operator training are included. Warranty is 12 months, extended on request. Remote diagnostics respond within 4 working hours, with an engineer on site the next working day around Kolkata and within 48 hours elsewhere in India. Spares are stocked, and service covers RA Machine's own machines only.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the most important question to ask before buying a CNC machine?",
      a: "Ask what materials and thicknesses the machine must handle every week, then ask the supplier to justify its recommended power or current against that work. Almost every other decision, from the electrical supply and gases to running cost and price, follows from this one. A machine sized for occasional jobs costs more to buy and run for no everyday benefit.",
    },
    {
      q: "How do I compare quotations from different CNC machine suppliers?",
      a: "Send every supplier the same written brief, ask for itemised quotations, and compare them in a table, one row per item or question. Check what is included as well as the price: chiller, extraction, software licences, spares, freight, installation and training. A cheaper quotation that leaves out items you need is usually the more expensive machine once they are added back.",
    },
    {
      q: "Should I see a demonstration before ordering?",
      a: "Yes, and on your own material if possible. Send the supplier a few typical drawings and some sample material, then watch the cut or weld at their works or on a live video call. Look at edge quality, accuracy and speed, and ask the operator questions. A demonstration on the supplier's own sample parts tells you far less about your work.",
    },
    {
      q: "What should a CNC machine warranty cover?",
      a: "A useful warranty states in writing which parts are covered, for how long, from which date, and what is excluded, such as consumables, wear parts and damage from poor power supply or misuse. It should also say how warranty repairs are handled: who pays for parts, labour and travel, and how quickly the supplier responds. Verbal assurances are hard to enforce later.",
    },
    {
      q: "Is a cheaper CNC machine a false economy?",
      a: "Not always, but cheap machines often cut corners where they are hardest to see: drives, frame stiffness, software licensing, training and after-sales support. Compare the cost over several years, including downtime, consumables, energy and service, rather than the purchase price alone. A machine that is idle waiting for a spare part costs far more than the saving at purchase.",
    },
  ],
  families: [
    "fiber-laser-cutting-machines",
    "cnc-plasma-cutting-machines",
    "mig-tig-arc-welding-machines",
  ],
  related: [
    "laser-vs-plasma-cutting",
    "preparing-factory-for-cnc-machine",
    "importing-cnc-machines-from-india",
  ],
  published: "2026-10-07",
  updated: "2026-10-07",
};
