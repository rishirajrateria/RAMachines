/**
 * data/certifications.ts — the 9 licences/certifications shown on the home page
 * strip, the /certifications page and product footers.
 *
 * To edit: change the fields below and swap the image at /public/certs/<slug>.webp
 * (600×800, same aspect ratio for every card). Order here is the display order —
 * keep ISO 9001 first and the two optional certificates (Startup India, BIS) last.
 * To add a new certificate: append an entry with a new slug, add its image, and
 * set `optional: true` if it does not apply to every export shipment.
 */
import type { Certification } from "./types";

export const certifications: Certification[] = [
  {
    slug: "iso-9001-2015",
    name: "ISO 9001:2015",
    issuer: "Accredited third-party certification body",
    oneLiner: "Certified quality management system covering design, manufacture and after-sales support.",
    description:
      "ISO 9001:2015 certifies that our quality management system, from design and fabrication through final inspection and after-sales support, is documented, audited and consistently followed. For a buyer, it means every RA Machine unit leaves the factory against a repeatable checklist, component traceability is maintained, and non-conformities are recorded and corrected rather than overlooked. Many government, PSU and large private tenders make ISO 9001 certification a mandatory pre-qualification requirement, so it also keeps our machines eligible for institutional procurement in India and abroad.",
    image: { src: "/certs/iso-9001-2015.webp", alt: "ISO 9001:2015 quality management certificate", width: 600, height: 800 },
  },
  {
    slug: "ce-marking",
    name: "CE Marking",
    issuer: "Self-declared conformity under applicable EU directives",
    oneLiner: "Declares conformity with EU machinery safety, low-voltage and EMC directives.",
    description:
      "CE marking is our declaration that a machine meets the essential health, safety and electromagnetic-compatibility requirements of the applicable EU directives, including the Machinery Directive and Low Voltage Directive. It matters most to export buyers in Europe and in the many other markets that recognise CE as a baseline safety benchmark: it confirms guarding, emergency-stop circuits, electrical enclosures and interlocks have been assessed against a recognised standard, which simplifies customs clearance, plant safety audits and insurance sign-off after the machine is installed.",
    image: { src: "/certs/ce-marking.webp", alt: "CE marking conformity declaration", width: 600, height: 800 },
  },
  {
    slug: "gst-registered",
    name: "GST Registered",
    issuer: "Government of India, Central Board of Indirect Taxes and Customs",
    oneLiner: "Registered under India's Goods and Services Tax regime for lawful, invoiced trade.",
    description:
      "GST registration confirms we are a recognised taxpaying entity operating under India's Goods and Services Tax law. For domestic buyers it means every invoice we raise is GST-compliant and eligible for input tax credit, and for institutional buyers it provides a transparent, auditable paper trail from quotation to payment. It is a basic but essential due-diligence check that procurement and finance teams verify before onboarding any new machinery supplier for organised, tax-compliant business.",
    image: { src: "/certs/gst-registered.webp", alt: "GST registration certificate", width: 600, height: 800 },
  },
  {
    slug: "msme-udyam",
    name: "MSME / Udyam Registered",
    issuer: "Ministry of Micro, Small & Medium Enterprises, Government of India",
    oneLiner: "Registered as a Micro, Small and Medium Enterprise under the Udyam scheme.",
    description:
      "Udyam registration recognises us as a formally classified Micro, Small or Medium Enterprise under the Ministry of MSME. This status is a factor in many government, PSU and railway tenders that reserve or give preference to MSME vendors, and it independently verifies our scale of manufacturing investment and turnover. For buyers evaluating suppliers for long-term relationships, it is additional evidence of an established, compliant Indian manufacturing enterprise rather than a trading intermediary.",
    image: { src: "/certs/msme-udyam.webp", alt: "MSME Udyam registration certificate", width: 600, height: 800 },
  },
  {
    slug: "iec-import-export-code",
    name: "IEC (Import Export Code)",
    issuer: "Directorate General of Foreign Trade (DGFT), Government of India",
    oneLiner: "Licensed Importer-Exporter Code enabling lawful cross-border machine shipments.",
    description:
      "The Import Export Code, issued by the DGFT, is the legal authorisation required to export goods from India. Holding a valid IEC means we can raise shipping bills, file export documentation and invoice international buyers correctly under Indian foreign trade law. For an overseas customer, it is confirmation that the export transaction, HS classification and customs paperwork will be handled by a properly licensed exporter, reducing the risk of clearance delays or documentation disputes at the destination port.",
    image: { src: "/certs/iec-import-export-code.webp", alt: "IEC import export code certificate", width: 600, height: 800 },
  },
  {
    slug: "indian-railways-vendor",
    name: "Indian Railways Listed Vendor",
    issuer: "Ministry of Railways / concerned railway zone or production unit",
    oneLiner: "Approved vendor for supply of machinery to Indian Railways workshops and production units.",
    description:
      "Listing as an Indian Railways vendor follows a vendor-approval process that examines technical capability, manufacturing quality and financial standing before a supplier is added to the approved panel. For a buyer, this is meaningful evidence beyond our own claims: it means our machines have been assessed against the demanding duty cycles and fabrication tolerances expected in railway coach, wagon and component workshops, one of the most rigorous industrial buyer categories in India.",
    image: { src: "/certs/indian-railways-vendor.webp", alt: "Indian Railways approved vendor listing", width: 600, height: 800 },
  },
  {
    slug: "make-in-india",
    name: "Make in India",
    issuer: "Department for Promotion of Industry and Internal Trade (DPIIT), Government of India",
    oneLiner: "Machines are designed, fabricated and assembled at our Kolkata manufacturing facility.",
    description:
      "Our alignment with the Government of India's Make in India initiative reflects that our machines are engineered, fabricated and assembled domestically rather than imported and rebadged. Practically, this shortens the supply chain for spares and structural components, keeps technical support and repair engineers close to the factory that built the machine, and satisfies the domestic-manufacture preference clauses written into many government and PSU tender documents.",
    image: { src: "/certs/make-in-india.webp", alt: "Make in India manufacturing certification", width: 600, height: 800 },
  },
  {
    slug: "startup-india",
    name: "Startup India",
    issuer: "Department for Promotion of Industry and Internal Trade (DPIIT), Government of India",
    oneLiner: "Recognised under the Government of India's Startup India initiative.",
    description:
      "Startup India recognition is granted to entities meeting the DPIIT's criteria for an innovation-driven, growth-stage enterprise, subject to periodic compliance and tax review. It does not replace our quality certifications, but it corroborates that RA Machine operates as a registered, monitored business entity under active government oversight, which some buyers and financing partners take into account during vendor due diligence alongside our ISO and export credentials.",
    image: { src: "/certs/startup-india.webp", alt: "Startup India recognition certificate", width: 600, height: 800 },
    optional: true,
  },
  {
    slug: "bis",
    name: "BIS",
    issuer: "Bureau of Indian Standards",
    oneLiner: "Conformity of applicable components and safety systems to relevant Indian national standards.",
    description:
      "Where applicable, electrical components, control panels and safety sub-assemblies used in our machines conform to the relevant Bureau of Indian Standards specifications. This is most relevant to institutional and government buyers whose procurement rules require BIS-marked components for electrical safety compliance. Applicability varies by machine and component, so BIS conformity for a specific model and sub-assembly can be confirmed in writing at the quotation stage.",
    image: { src: "/certs/bis.webp", alt: "BIS Bureau of Indian Standards conformity", width: 600, height: 800 },
    optional: true,
  },
];
