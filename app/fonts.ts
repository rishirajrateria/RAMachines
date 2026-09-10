import localFont from "next/font/local";

/**
 * Self-hosted fonts (see NOTES.md for the rationale):
 *  - Manrope 400/600 — UI & body: a clean, slightly geometric grotesque with excellent
 *    numerals for spec tables; corporate without being generic.
 *  - Barlow Semi Condensed 600 — display: a compact, engineered face that reads like
 *    machine-tool signage and lets long headlines fit on mobile.
 * Files are copied from the @fontsource packages (OFL licence) into app/fonts/.
 */
export const fontUi = localFont({
  src: [
    { path: "./fonts/manrope-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/manrope-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-ui",
  display: "swap",
  preload: true,
});

export const fontDisplay = localFont({
  src: [{ path: "./fonts/barlow-semi-condensed-latin-600-normal.woff2", weight: "600", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  preload: true,
});
