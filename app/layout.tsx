import type { Metadata, Viewport } from "next";
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
      <head>
        {/*
          ADR-0010 bootstrap. Two jobs, and it has to be inline in <head> to do
          either without a flash:

          1. Add the `js` class before first paint. `.reveal` only takes its
             hidden initial state under `.js` (see app/globals.css), so a no-JS
             visitor never sees `.reveal` at all — and a JS visitor never sees
             content appear and then hide.
          2. Guarantee that can't strand anyone. If /enhance.js fails to load,
             nothing would ever add `.is-in` and `.reveal` content would stay
             invisible. So: if the runtime hasn't signalled `window.__enh`
             within 3s, take `js` back off and let everything show.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'document.documentElement.classList.add("js");' +
              'setTimeout(function(){if(!window.__enh)document.documentElement.classList.remove("js")},3000)',
          }}
        />
      </head>
      <body className="bg-[#F6F8F9] text-ink">
        {/*
          ADR-0009 §3: HeaderBar's scroll state (the floating nav pill going slightly
          more opaque past 24px of scroll) watches this sentinel with an
          IntersectionObserver instead of a scroll listener — it sits in normal flow
          at the very top of the page, so once the user has scrolled its height past
          the viewport top, the observer fires exactly once instead of every frame.
        */}
        <span id="scroll-sentinel" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
        <SkipLink />
        <AmbientLight />
        <Header />
        <main id="main" className="pt-24">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {/*
          ADR-0010: the entire client-side runtime — scroll reveal, count-up,
          card sheen, header scroll state, mobile nav, hero video, map, cert
          modal, product filter. ~4 KB gzipped, replacing ~112 KB of React.
          `defer` so it never blocks parsing or paint.
        */}
        <script src="/enhance.js" defer />
      </body>
    </html>
  );
}
