import type { Metadata } from "next";
import "./globals.css";
import { fontUi } from "./fonts";
import { site } from "@/config/site";
import SkipLink from "@/components/layout/SkipLink";
import AmbientLight from "@/components/layout/AmbientLight";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import JsonLd from "@/components/ui/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={fontUi.variable}>
      <body className="bg-[#F6F8F9] text-ink">
        <SkipLink />
        <AmbientLight />
        <Header />
        <main id="main" className="pt-24">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
