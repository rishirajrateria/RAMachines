import localFont from "next/font/local";

/**
 * Self-hosted fonts. ADR-0005 "Liquid Glass" §3: one family site-wide — Manrope
 * (400 body, 600 headings/display). Barlow Semi Condensed is no longer loaded
 * (its files stay under app/fonts/ unused, per the ADR, in case a future ADR
 * brings it back); `fontDisplay` now points at the same Manrope variable so
 * every `font-display` class keeps compiling and resolving correctly.
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
