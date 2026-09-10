/**
 * app/_home/copy.ts — long-form copy for the home page (app/page.tsx), kept in a
 * sibling file so the page component stays short and readable. Edit the text below
 * directly; nothing here is structured data, so no types beyond plain strings/arrays.
 */

export const heroSub =
  "RA Machine designs, builds and exports fiber laser, tube laser, CO2 laser and robotic welding machines from our own manufacturing facility in Kolkata, with installation, training and after-sales service delivered across India and to customers in more than 25 countries.";

export const introParagraph =
  "For more than a decade, fabrication shops, OEM manufacturers and export buyers have turned to RA Machine for laser cutting and robotic welding equipment that is engineered, built and supported in India. Every machine that leaves our Kolkata works is tested, calibrated and backed by an in-house team of engineers who understand it because they built it — which is why we are able to promise a response time you can plan around, whether your machine is running in Ludhiana or Lagos.";

export const whyPoints: { title: string; text: string }[] = [
  {
    title: "Manufactured in India",
    text: "Every machine is designed, fabricated and assembled at our Kolkata facility rather than imported and rebadged, giving us direct control over build quality and component sourcing from raw steel through to final testing.",
  },
  {
    title: "Pan-India service reach",
    text: "Engineers dispatched from our Kolkata headquarters install, commission and service machines across every state and union territory, backed by remote diagnostics for a faster response between scheduled visits.",
  },
  {
    title: "Export and installation support",
    text: "We export to more than 25 countries with pre-shipment video inspection and structured remote or on-site commissioning, so a new production line can be running within weeks of the machine's arrival.",
  },
  {
    title: "Spares availability",
    text: "Commonly replaced items such as nozzles, lenses, filters and drive components are stocked for fast dispatch, keeping unplanned downtime to a minimum wherever in the world your machine is installed.",
  },
  {
    title: "Operator training included",
    text: "Every machine purchase includes structured operator training on safe operation, nesting software and routine maintenance, delivered either at your facility during installation or at our Kolkata training centre.",
  },
  {
    title: "Indian Railways listed vendor",
    text: "Our manufacturing quality has been examined and approved for supply to Indian Railways workshops and production units, one of the most demanding industrial buyer categories in the country.",
  },
];

export const servicesStrip: {
  name: string;
  text: string;
  href: string;
  external?: boolean;
}[] = [
  {
    name: "Machine Repair",
    text: "On-site and remote repair, AMC plans and spares support for laser cutting and robotic welding equipment of any make, with engineers dispatched pan-India from Kolkata.",
    href: "/services/machine-repair",
  },
  {
    name: "Operator Training",
    text: "Structured training on safe machine operation, nesting software and day-to-day maintenance, delivered at your facility or at our Kolkata training centre.",
    href: "/services/operator-training",
  },
  {
    name: "Job Work",
    text: "Send us your drawing and material specification and we will produce precision parts on our own machines, ideal when you need components made without owning a machine.",
    href: "/services/laser-cutting-job-work",
  },
  {
    name: "RA Auto",
    text: "The automotive division of RA Group, serving India's automotive component and aftermarket sector under the same engineering standards.",
    href: "https://raauto.net",
    external: true,
  },
];

export const certIntro =
  "Every RA Machine unit is built under a documented, audited quality system and shipped with the licences and registrations that global procurement and compliance teams check before signing off a new supplier. Our certifications span quality management, export authorisation, safety conformity and government-recognised manufacturing status, and we are glad to share verifiable certificate copies during the quotation process for any tender or audit requirement.";

export const reachIntro =
  "RA Machine is installed in fabrication shops across every major Indian industrial belt and, through our export programme, in workshops on five continents. Wherever your factory sits, the same Kolkata-built machine, the same spares network and the same service commitment travels with it.";

export const ctaText =
  "Tell us about your material, thickness and production volume and our sales engineers will recommend the right machine and send a formal, itemised quotation. Prefer to talk first? Call or WhatsApp us directly, or send an email — our team responds within one working day.";
