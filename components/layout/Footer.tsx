/**
 * components/layout/Footer.tsx — ADR-0005 §5: plain (no band), hairline top, 4
 * slim columns, 13px grey text, wordmark. Address, contact, quick links
 * (including the job-work link, which per SPEC §3 appears in the footer only,
 * never in the nav), product categories, top cities, top countries,
 * certifications as small glass pill badges and legal links.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { categories, certifications, topCities, topCountries } from "@/data";
import type { City, Country } from "@/data/types";
import { Phone, Mail, Clock, MapPin } from "@/components/ui/Icons";

const quickLinks = [
  { name: "Products", href: paths.products },
  { name: "Machine Repair", href: paths.repair },
  { name: "Operator Training", href: paths.training },
  { name: "Export Enquiry", href: paths.exportHub },
  { name: "Job Work on Our Machines", href: paths.jobWork },
  { name: "About", href: paths.about },
  { name: "Contact", href: paths.contact },
];

function ColumnHeading({ children }: { children: string }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.1em] text-grey-500">{children}</p>;
}

export default function Footer() {
  const cities = topCities(12);
  const countries = topCountries(10);

  return (
    <footer className="border-t border-[rgba(15,26,26,0.08)]">
      <div className="container-site grid gap-10 py-14 text-[13px] md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ink">{site.name}</p>
          <p className="mt-1 text-grey-500">an RA Group company</p>
          <address className="mt-4 flex gap-2 not-italic text-grey-600">
            <MapPin width={15} height={15} className="mt-0.5 shrink-0 text-teal" />
            {site.address.full}
          </address>
          <a href={site.phoneHref} className="mt-3 flex items-center gap-2 text-grey-600 hover:text-teal">
            <Phone width={15} height={15} className="text-teal" /> {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="mt-2 flex items-center gap-2 text-grey-600 hover:text-teal">
            <Mail width={15} height={15} className="text-teal" /> {site.email}
          </a>
          <p className="mt-2 flex items-center gap-2 text-grey-600">
            <Clock width={15} height={15} className="text-teal" /> {site.hours}
          </p>
        </div>

        <div>
          <ColumnHeading>Quick links</ColumnHeading>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-grey-600 hover:text-teal">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ColumnHeading>Machines</ColumnHeading>
          </div>
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={paths.category(category.slug)} className="text-grey-600 hover:text-teal">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnHeading>Across India</ColumnHeading>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {cities.map((city: City) => (
              <li key={city.slug}>
                <Link href={paths.city(city.stateSlug, city.slug)} className="text-grey-600 hover:text-teal">
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnHeading>Exporting to</ColumnHeading>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {countries.map((country: Country) => (
              <li key={country.slug}>
                <Link href={paths.country(country.slug)} className="text-grey-600 hover:text-teal">
                  {country.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(15,26,26,0.08)]">
        <div className="container-site py-8">
          <ColumnHeading>Licences &amp; certifications</ColumnHeading>
          <ul className="mt-4 flex flex-wrap items-center gap-2.5">
            {certifications.map((cert) => (
              <li key={cert.slug}>
                <Link href={paths.certifications} className="chip">
                  {cert.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(15,26,26,0.08)]">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-grey-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              &copy; {new Date().getFullYear()} {site.legalName}. Made in India.
            </span>
            <a href={site.url} className="hover:text-teal">
              {site.parent}
            </a>
            <a href={site.raAuto.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal">
              {site.raAuto.name} ↗
            </a>
          </div>
          <div className="flex gap-4">
            <Link href={paths.privacy} className="hover:text-teal">
              Privacy Policy
            </Link>
            <Link href={paths.terms} className="hover:text-teal">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
