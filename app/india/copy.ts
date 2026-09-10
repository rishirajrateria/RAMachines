/**
 * app/india/copy.ts — long-form copy for the /india hub page (the directory
 * page above the 36 state pages and ~170 city pages). Per-state and per-city
 * copy is composed separately in lib/copy/state.ts and lib/copy/city.ts from
 * data/states.ts and data/cities.ts; this file only covers the hub itself.
 * Kept short (ADR-0003 target: 400–600 visible words for the whole hub page)
 * since the region-card directory below already shows every state and UT by
 * name — this prose only needs to explain why the pages are split out and
 * how delivery/service reach every location, not restate the directory.
 * To edit: change the paragraphs below directly.
 */

/** Opening section — who we serve and how the state/city pages are organised. */
export const hubIntro: string[] = [
  "RA Machine manufactures fiber laser cutting machines, CO2 laser machines, tube laser cutting machines and robotic MIG/MAG welding systems at our Kolkata facility, and we deliver, install and service every machine we sell across all 28 states and 8 union territories. This page lists every state and union territory page, each linking on to the cities within it where we see the steadiest demand.",
  "India's manufacturing geography is not uniform: automotive clusters around Pune and Chakan need a different machine mix to the ceramics and engineering hubs of Morbi and Rajkot, and both differ again from the foundry belt around Howrah in our home state of West Bengal or the precision-engineering base growing around Bengaluru. Rather than one generic national page, each state and its cities get a dedicated page with facts specific to that place.",
];

/** Second section — how pan-India delivery, service and training actually work. */
export const hubDelivery: string[] = [
  "Every machine is built, tested and dispatched from our Kolkata facility and installed to the same process nationwide, from a pre-dispatch site survey through commissioning and test cuts to a formal handover. We do not run branch offices; service is remote-first, backed by engineers dispatched from Kolkata for the visits that need one, and operator training is included with every installation, with AMC plans available. Each state page states the response-time commitment for that location.",
];
