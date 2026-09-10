/**
 * data/states.ts — barrel file for all 36 Indian state/UT data entries used by
 * the `/india/[state]` programmatic SEO pages.
 *
 * The actual `State` objects live in `data/states/*.ts`, split into small
 * regional modules (west, central, south-1, south-2, north-1, north-2, east,
 * northeast-1, northeast-2) so no single file grows unwieldy. This file merges
 * them, reorders the result to exactly match the canonical state/UT order in
 * `data/india-index.ts`, and exposes the typed accessors consumed by the rest
 * of the site (see lib/copy/state.ts and app/india/**).
 *
 * To add or edit a state: edit its object in the relevant `data/states/*.ts`
 * region file (see the `State` interface in `data/types.ts` for the required
 * shape). If a brand-new state/UT is ever added to `data/india-index.ts`, add
 * a matching object to whichever region file makes sense (or create a new
 * region file and import it below) — `states` will pick it up automatically
 * as long as the slug matches.
 */
import type { Region, State } from "./types";
import { indiaIndex } from "./india-index";
import { westStates } from "./states/west";
import { centralStates } from "./states/central";
import { south1States } from "./states/south-1";
import { south2States } from "./states/south-2";
import { north1States } from "./states/north-1";
import { north2States } from "./states/north-2";
import { eastStates } from "./states/east";
import { northeast1States } from "./states/northeast-1";
import { northeast2States } from "./states/northeast-2";

const allStates: State[] = [
  ...westStates,
  ...centralStates,
  ...south1States,
  ...south2States,
  ...north1States,
  ...north2States,
  ...eastStates,
  ...northeast1States,
  ...northeast2States,
];

const stateBySlug = new Map<string, State>(allStates.map((s) => [s.slug, s]));

if (stateBySlug.size !== allStates.length) {
  throw new Error("data/states.ts: duplicate state slug detected across data/states/*.ts region files");
}

/**
 * All 36 states/UTs, in the exact order of `data/india-index.ts` (the
 * canonical list). Throws at build time if a region file is missing an
 * entry for a slug listed in the index, so gaps are caught immediately.
 */
export const states: State[] = indiaIndex.map((entry) => {
  const state = stateBySlug.get(entry.slug);
  if (!state) {
    throw new Error(`data/states.ts: missing State entry for "${entry.slug}" (present in data/india-index.ts)`);
  }
  return state;
});

/** Look up a single state by slug, e.g. getState("west-bengal"). */
export function getState(slug: string): State | undefined {
  return stateBySlug.get(slug);
}

/** All states grouped by Region, each group in canonical index order. */
export function statesByRegion(): Record<Region, State[]> {
  const groups: Record<Region, State[]> = {
    North: [],
    South: [],
    East: [],
    West: [],
    Central: [],
    "North-East": [],
  };
  for (const state of states) {
    groups[state.region].push(state);
  }
  return groups;
}

/**
 * The top `n` states for footer/home-page linking: large-tier states first
 * (in canonical index order), followed by medium then small tier states if
 * `n` exceeds the number of large-tier states.
 */
export function topStates(n: number): State[] {
  const large = states.filter((s) => s.tier === "large");
  const medium = states.filter((s) => s.tier === "medium");
  const small = states.filter((s) => s.tier === "small");
  return [...large, ...medium, ...small].slice(0, n);
}
