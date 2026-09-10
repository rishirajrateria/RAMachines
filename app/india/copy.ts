/**
 * app/india/copy.ts — long-form copy for the /india hub page (the directory
 * page above the 36 state pages and ~170 city pages). Per-state and per-city
 * copy is composed separately in lib/copy/state.ts and lib/copy/city.ts from
 * data/states.ts and data/cities.ts; this file only covers the hub itself.
 * To edit: change the paragraphs below directly.
 */

/** Opening section — who we serve and how the state/city pages are organised. */
export const hubIntro: string[] = [
  "RA Machine manufactures fiber laser cutting machines, CO2 laser machines, tube laser cutting machines and robotic MIG/MAG welding systems at our facility in Kolkata, and we deliver, install and service every machine we sell across all 28 states and 8 union territories of India. This page is the starting point for that coverage: it lists every state and union territory page we maintain, and each of those in turn links to the cities within it where we see the steadiest demand.",
  "India's manufacturing geography is not uniform, and neither is our approach to it. Automotive component clusters around Pune and Chakan in Maharashtra need a different mix of machines to the ceramics and engineering hubs of Morbi and Rajkot in Gujarat, and both differ again from the foundry belt around Howrah in our home state of West Bengal or the aerospace and precision-engineering base growing around Bengaluru in Karnataka. Rather than publish one generic national page, we have built a dedicated page for every state and union territory, and for the cities within each one where fabrication activity is concentrated, so a buyer researching a machine for their own location finds facts specific to that place rather than a description that could apply anywhere.",
  "Every state page sets out the state's key manufacturing industries and the RA Machine model we typically recommend for each, its main industrial estates and SEZs, what delivery and installation from our Kolkata works actually involves, how service, AMC and spares support reach that state without our needing a local branch office, and where operator training is available. City pages narrow this down further to the specific industrial areas, recommended machines and nearby cities relevant to that location.",
];

/** Second section — how pan-India delivery, service and training actually work. */
export const hubDelivery: string[] = [
  "Every machine we sell, whether it is going to a workshop a few hours from Kolkata or to the far end of the country, is built, tested and dispatched from the same Kolkata facility, and follows the same installation process: a site survey checklist agreed before dispatch, transport by road, rail or coastal freight depending on the destination and machine size, a foundation and 415 V three-phase power check on arrival, mechanical installation and levelling, calibration and test cuts on your own material, and a formal handover once cut quality is confirmed.",
  "We do not operate branch offices or claim dealer addresses in individual states or cities; service reach across India works through a combination of remote diagnostics, which resolve most controller, software and electrical faults within hours, and engineers dispatched from our Kolkata headquarters for the site visits that genuinely need one. Every state page states the response commitment this implies for that location, and Annual Maintenance Contracts are available wherever your machine is installed. Operator training is included with every installation and delivered on-site at handover, with a more structured programme also available at our training centre in Kolkata for teams that want it.",
];
