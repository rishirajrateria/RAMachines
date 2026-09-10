/**
 * data/cities.ts — barrel file for the RA Machine India city dataset.
 *
 * This file re-exports and combines every per-state/region module under `data/cities/`
 * into one flat `cities` array, in the same state order as the canonical
 * `data/india-index.ts`. Each per-state module exports `export const cities: City[]`.
 *
 * TO ADD OR EDIT A CITY:
 * 1. The city's slug/name/stateSlug/isTop must already exist in `data/india-index.ts`
 *    (owned by the integration owner) — add it there first if it is missing.
 * 2. Find the matching module under `data/cities/<state-or-group>.ts` (see the
 *    import list below for which file owns which state) and add/edit the `City`
 *    object there, following the shape in `data/types.ts`.
 * 3. If you add a brand-new state module, import it below with a unique alias and
 *    spread it into the `cities` array in the same position its state occupies in
 *    `data/india-index.ts` (this keeps `topCities()` returning cities in index order).
 *
 * TO ADD A NEW STATE MODULE FILE:
 * Create `data/cities/<name>.ts` exporting `export const cities: City[] = [...]`,
 * then import and spread it here.
 */
import type { City } from "./types";

import { cities as maharashtraCities } from "./cities/maharashtra";
import { cities as gujaratCities } from "./cities/gujarat";
import { cities as tamilNaduCities } from "./cities/tamil-nadu";
import { cities as karnatakaCities } from "./cities/karnataka";
import { cities as uttarPradeshCities } from "./cities/uttar-pradesh";
import { cities as punjabCities } from "./cities/punjab";
import { cities as haryanaCities } from "./cities/haryana";
import { cities as rajasthanCities } from "./cities/rajasthan";
import { cities as westBengalCities } from "./cities/west-bengal";
import { cities as delhiCities } from "./cities/delhi";
import { cities as telanganaCities } from "./cities/telangana";
import { cities as andhraPradeshCities } from "./cities/andhra-pradesh";
import { cities as madhyaPradeshCities } from "./cities/madhya-pradesh";
import { cities as keralaCities } from "./cities/kerala";
import { cities as assamCities } from "./cities/assam";
import { cities as biharCities } from "./cities/bihar";
import { cities as chhattisgarhCities } from "./cities/chhattisgarh";
import { cities as goaDnhCities } from "./cities/goa-dnh"; // Goa + Dadra and Nagar Haveli and Daman and Diu
import { cities as himachalUttarakhandJkCities } from "./cities/himachal-uttarakhand-jk"; // Himachal Pradesh + Uttarakhand + Jammu and Kashmir
import { cities as jharkhandCities } from "./cities/jharkhand";
import { cities as odishaCities } from "./cities/odisha";
import { cities as arunachalManipurMeghalayaCities } from "./cities/arunachal-manipur-meghalaya";
import { cities as mizoramNagalandSikkimTripuraCities } from "./cities/mizoram-nagaland-sikkim-tripura";
import { cities as chandigarhLadakhCities } from "./cities/chandigarh-ladakh";
import { cities as puducherryCities } from "./cities/puducherry";
import { cities as andamanLakshadweepCities } from "./cities/andaman-lakshadweep"; // Andaman & Nicobar Islands + Lakshadweep

/** All ~170 India city pages, ordered to match data/india-index.ts. */
export const cities: City[] = [
  ...maharashtraCities,
  ...gujaratCities,
  ...tamilNaduCities,
  ...karnatakaCities,
  ...uttarPradeshCities,
  ...punjabCities,
  ...haryanaCities,
  ...rajasthanCities,
  ...westBengalCities,
  ...delhiCities,
  ...telanganaCities,
  ...andhraPradeshCities,
  ...madhyaPradeshCities,
  ...keralaCities,
  ...assamCities,
  ...biharCities,
  ...chhattisgarhCities,
  ...goaDnhCities,
  ...himachalUttarakhandJkCities,
  ...jharkhandCities,
  ...odishaCities,
  ...arunachalManipurMeghalayaCities,
  ...mizoramNagalandSikkimTripuraCities,
  ...chandigarhLadakhCities,
  ...puducherryCities,
  ...andamanLakshadweepCities,
];

/** Look up a single city by its state slug and city slug (used by /india/[state]/[city]). */
export function getCity(stateSlug: string, citySlug: string): City | undefined {
  return cities.find((c) => c.stateSlug === stateSlug && c.slug === citySlug);
}

/** All cities belonging to a given state slug (used by /india/[state] to list its cities). */
export function citiesByState(stateSlug: string): City[] {
  return cities.filter((c) => c.stateSlug === stateSlug);
}

/** The 12 footer-linked top cities, in data/india-index.ts order. */
export function topCities(n?: number): City[] {
  const top = cities.filter((c) => c.isTop === true);
  return n ? top.slice(0, n) : top;
}
