/**
 * data/countries.ts — barrel for the 30 export country pages (/export/[country]).
 *
 * Country content lives in data/countries/<region>.ts, one file per WorldRegion, each
 * exporting an array of `Country` objects (see data/types.ts for the shape). This file
 * just concatenates them and exposes typed accessors.
 *
 * To edit a country: open its region file under data/countries/ and change the object.
 * To add a country: add a Country object to the relevant region file's array (or create a
 * new region file and re-export it below) — no other file needs to change.
 */
import type { Country, WorldRegion } from "./types";
import { northAmericaCountries } from "./countries/north-america";
import { southAmericaCountries } from "./countries/south-america";
import { europeCountries } from "./countries/europe";
import { middleEastCountries } from "./countries/middle-east";
import { southAsiaCountries } from "./countries/south-asia";
import { southEastAsiaCountries } from "./countries/south-east-asia";
import { centralAsiaCountries } from "./countries/central-asia";
import { africaCountries } from "./countries/africa";
import { oceaniaCountries } from "./countries/oceania";

export const countries: Country[] = [
  ...northAmericaCountries,
  ...southAmericaCountries,
  ...europeCountries,
  ...middleEastCountries,
  ...southAsiaCountries,
  ...southEastAsiaCountries,
  ...centralAsiaCountries,
  ...africaCountries,
  ...oceaniaCountries,
];

export function getCountry(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

export function countriesByRegion(): Record<WorldRegion, Country[]> {
  const regionOrder: WorldRegion[] = [
    "North America",
    "South America",
    "Europe",
    "Middle East",
    "South Asia",
    "South-East Asia",
    "Central Asia",
    "Africa",
    "Oceania",
  ];
  const grouped = Object.fromEntries(regionOrder.map((r) => [r, [] as Country[]])) as Record<
    WorldRegion,
    Country[]
  >;
  for (const country of countries) {
    grouped[country.region].push(country);
  }
  return grouped;
}

export function topCountries(): Country[] {
  return countries.filter((c) => c.isTop);
}

export const countryCount = countries.length; // 30
