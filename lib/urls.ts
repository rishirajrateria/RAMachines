/**
 * lib/urls.ts — canonical path builders. Import `paths` instead of hand-writing route
 * strings anywhere in the app, so a route can be renamed in one place.
 */
export const paths = {
  home: "/",
  products: "/products",
  category: (c: string) => `/products/${c}`,
  product: (c: string, s: string) => `/products/${c}/${s}`,
  repair: "/services/machine-repair",
  training: "/services/operator-training",
  jobWork: "/services/laser-cutting-job-work",
  about: "/about",
  contact: "/contact",
  certifications: "/certifications",
  state: (s: string) => `/india/${s}`,
  city: (s: string, c: string) => `/india/${s}/${c}`,
  exportHub: "/export",
  country: (c: string) => `/export/${c}`,
  privacy: "/privacy-policy",
  terms: "/terms",
} as const;
