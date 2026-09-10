import type { Metadata, Viewport } from "next";
import Script from "next/script";
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

// ADR-0006 §Polish: meta theme-color matches the page background.
export const viewport: Viewport = {
  themeColor: "#F6F8F9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={fontUi.variable}>
      <body className="bg-[#F6F8F9] text-ink">
        {/*
          ADR-0006 §Motion 1: reveal-on-scroll must never hide content from a
          no-JS visitor — `.reveal` only gets its hidden initial state once this
          class lands (see `.js .reveal` in app/globals.css). `beforeInteractive`
          runs this before hydration/paint of the rest of the page, so JS visitors
          never see a flash of visible-then-hidden content either.
        */}
        <Script id="js-class" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
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
