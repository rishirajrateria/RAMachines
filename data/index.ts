/**
 * data/index.ts — typed barrel over every data file. Page templates should import
 * from "@/data" rather than reaching into individual data files, so the underlying
 * file layout (e.g. a folder of per-region modules) can change without breaking pages.
 * Each named export below is written by the data worker that owns the source file
 * (see docs/adr/0001-stack-and-ownership.md §4); this file only re-exports.
 */
export { products, getProduct, productsByCategory } from "@/data/products";
export { categories, getCategory } from "@/data/categories";
export { states, getState, statesByRegion, topStates } from "@/data/states";
export { cities, getCity, citiesByState, topCities } from "@/data/cities";
export { countries, getCountry, countriesByRegion, topCountries } from "@/data/countries";
export { certifications } from "@/data/certifications";
export { testimonials } from "@/data/testimonials";
export { homeFaqs } from "@/data/faqs";
