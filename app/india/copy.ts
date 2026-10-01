/**
 * app/india/copy.ts — the one-sentence hero copy and AboutBlurb context for the
 * /india hub page (ADR-0005 §6: hero panel with H1 + one sentence, no prose
 * column — the 36 state pages and ~170 city pages each carry their own long-form
 * copy via lib/copy/state.ts / lib/copy/city.ts). To edit: change the strings below.
 */

/** One sentence shown under the H1 inside the hero panel. */
export const hubHeroSentence =
  "One dedicated page for every Indian state, union territory and major industrial city, covering how we deliver, install and service machines built in India and dispatched from Kolkata.";

/** Appended to the standard AboutBlurb paragraph below the hero. */
export const hubAboutContext =
  "This page lists every Indian state and union territory we deliver, install and service machines in, and links on to the cities within each.";
