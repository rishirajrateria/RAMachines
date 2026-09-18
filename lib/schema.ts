/**
 * lib/schema.ts — JSON-LD builders. Every function returns a plain object; render it with
 * <JsonLd data={...} /> (components/ui/JsonLd.tsx). Combine several with an array.
 */
import { site } from "@/config/site";
import { absUrl } from "@/lib/seo";
import type { Product } from "@/data/types";

export function organizationSchema(): object {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absUrl("/logo.svg"),
    foundingDate: String(site.foundedYear),
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      email: site.email,
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function localBusinessSchema(extra?: {
  areaServed?: string | string[];
  name?: string;
  url?: string;
}): object {
  return {
    "@type": "LocalBusiness",
    "@id": `${extra?.url ?? site.url}/#localbusiness`,
    name: extra?.name ?? site.name,
    url: extra?.url ?? site.url,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "Contact for price",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    openingHoursSpecification: site.hoursSchema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h,
    })),
    ...(extra?.areaServed ? { areaServed: extra.areaServed } : {}),
  };
}

export function websiteSchema(): object {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.href),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): object {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Product entity for a machine.
 *
 * `offers` carries no price, and that is deliberate: these are made-to-order
 * capital machines quoted per configuration, so any number here would be
 * invented. An earlier version tried to say so with
 * `priceSpecification: "Contact for price"` — which is invalid, because
 * `priceSpecification` takes a PriceSpecification object, not a string, and a
 * validator simply rejects it. Stating availability, seller and currency
 * honestly, and leaving price out, is worth more than a field that fails
 * validation. (Google will note the missing price; without a public price that
 * is the correct outcome, and the rest of the entity still resolves.)
 *
 * `additionalProperty` publishes the real spec table — laser power, bed size,
 * cutting thickness and so on — as machine-readable values, which is what
 * actually helps a search or answer engine match this machine to a query like
 * "3 kW fiber laser 1500x3000".
 */
export function productSchema(p: Product): object {
  return {
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    mpn: p.sku,
    category: p.category,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@id": `${site.url}/#organization` },
    itemCondition: "https://schema.org/NewCondition",
    description: p.shortDescription,
    image: p.images.map((img) => absUrl(img.src)),
    url: absUrl(`/products/${p.category}/${p.slug}`),
    additionalProperty: p.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
    material: p.materials.map((m) => m.material),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url: absUrl(`/products/${p.category}/${p.slug}`),
      seller: { "@id": `${site.url}/#organization` },
      areaServed: "Worldwide",
    },
  };
}

export function serviceSchema(o: {
  name: string;
  description: string;
  path: string;
  areaServed?: string | string[];
  serviceType?: string;
}): object {
  return {
    "@type": "Service",
    name: o.name,
    description: o.description,
    url: absUrl(o.path),
    serviceType: o.serviceType ?? o.name,
    areaServed: o.areaServed ?? "India",
    provider: { "@id": `${site.url}/#organization` },
  };
}

export function courseSchema(o: { name: string; description: string; path: string }): object {
  return {
    "@type": "Course",
    name: o.name,
    description: o.description,
    url: absUrl(o.path),
    provider: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.url,
    },
  };
}
