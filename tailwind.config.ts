import type { Config } from "tailwindcss";

/**
 * Design tokens — ADR-0005 "Liquid Glass" (supersedes ADR-0002, ADR-0004). Calm,
 * near-white canvas; frosted glass surfaces; pill shapes; one accent (teal). The
 * `spark` (orange) token stays defined so any stray legacy class still compiles,
 * but nothing in the design system renders it — see app/globals.css. `steel` stays
 * as an alias of `teal` for the same reason. `ink`/`grey` are the neutral scale.
 * `display-md` (H2) still carries the ADR-0005 §3 type scale.
 *
 * ADR-0008 §3 "Make it stunning": adds depth/contrast tokens on top of Liquid
 * Glass — `ink.deep` (deep-section background ink, distinct from the `ink` text
 * colour) for `.band-deep` (app/globals.css); a two-layer `shadow-lift` (tight
 * contact + wide ambient) for elevated/hover states; a `stat` type step for spec/
 * fact numerals (large, tabular numerals — see `.text-stat` in globals.css, which
 * adds the `font-variant-numeric` this scale can't express); `eyebrow` tightened
 * to 11px/.18em; and `display-xl` (the home hero H1 only — `display-lg`, used by
 * every inner-page H1, is intentionally left at the ADR-0006 scale so this pass
 * doesn't reflow pages outside this worker's scope) raised to the ADR §3 ceiling,
 * `clamp(3rem, 7vw, 6rem)` at -0.04em.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem", xl: "2rem" }, screens: { "2xl": "1720px" } },
    extend: {
      colors: {
        // ADR-0008 §3 — `deep` is the near-black used for `.band-deep`'s gradient start
        // (a section *background*), distinct from `DEFAULT`/`soft` which are *text* inks.
        ink: { DEFAULT: "#0F1A1A", soft: "#2B2D31", deep: "#0B1414" },
        grey: {
          50: "#F7F7F8",
          100: "#EFEFF1",
          200: "#E1E2E5",
          300: "#C9CBD0",
          400: "#A2A5AC",
          500: "#7A7E87",
          600: "#5B5F68",
          700: "#44474E",
          800: "#2B2D31",
          900: "#111214",
        },
        teal: { DEFAULT: "#0F766E", hover: "#0B5C56", deep: "#084C47", light: "#2A9D93", soft: "#E6F4F2", softer: "#F2FAF9" },
        // Alias — every pre-existing `steel`/`steel-hover`/`steel-soft` class renders teal.
        steel: { DEFAULT: "#0F766E", hover: "#0B5C56", soft: "#E6F4F2" },
        // Kept defined (ADR-0005 §4) so old classes compile; nothing renders it.
        spark: { DEFAULT: "#F26A21", hover: "#D65A17", soft: "#FFF1EA" },
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-ui)", "ui-sans-serif", "sans-serif"],
        display: ["var(--font-display)", "var(--font-ui)", "sans-serif"],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
        pill: "9999px",
        full: "9999px",
      },
      boxShadow: {
        card: "inset 0 1px 0 rgba(255,255,255,.9), 0 10px 40px rgba(15,26,26,.08)",
        "card-hover": "0 16px 48px rgba(15,26,26,.12)",
        glass: "inset 0 1px 0 rgba(255,255,255,.9), 0 10px 40px rgba(15,26,26,.08)",
        // ADR-0008 §3 — two-layer "lift" shadow: a tight, close contact shadow (grounds
        // the element) plus a wide, soft ambient shadow (reads as elevation/depth). Used
        // for elements that visibly lift on hover — product renders, bento tiles — as a
        // Tailwind utility (`shadow-lift`) alongside the hand-written two-layer shadows
        // refined directly on `.glass`/`.glass-strong`/`.glass-pill` in globals.css.
        lift: "0 3px 8px rgba(15,26,26,.10), 0 28px 68px -10px rgba(15,26,26,.22)",
      },
      maxWidth: { site: "1720px", content: "1200px", prose: "66ch" },
      spacing: { 18: "4.5rem", 22: "5.5rem" },
      fontSize: {
        // ADR-0008 §3 — the home hero H1 only: raised to the "up to clamp(3rem, 7vw, 6rem)"
        // ceiling at -0.04em (was clamp(2.75rem, 6vw, 5rem)/-0.035em, ADR-0006 §Polish).
        // `display-lg` (every inner-page H1) intentionally keeps the ADR-0006 scale below —
        // see the file-level comment.
        "display-xl": ["clamp(3rem, 7vw, 6rem)", { lineHeight: "1", letterSpacing: "-0.04em" }],
        // ADR-0006 §Polish — H1 letter-spacing tightened to -0.035em (was -0.03em, ADR-0005 §3).
        "display-lg": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        // ADR-0005 §3 H2 — clamp(1.9rem, 3.4vw, 2.75rem), ls -0.02em.
        "display-md": ["clamp(1.9rem, 3.4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        // ADR-0008 §3 — eyebrow 11px, tracking .18em (was 11.5px/.16em, ADR-0006 §Polish).
        eyebrow: ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.18em" }],
        // Step-downs from `stat`, for spec values too long to set at 40-64px —
        // see components/ui/statValue.ts, which picks the step from the value's
        // length so a measurement never has to wrap to fit its column.
        "stat-md": ["clamp(1.75rem, 3.2vw, 2.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "stat-sm": ["clamp(1.25rem, 2.2vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        // ADR-0008 §3 — spec/fact numerals: clamp(2.5rem, 5vw, 4rem), 600, tabular numerals.
        // `.text-stat` in globals.css adds `font-variant-numeric: tabular-nums` (not
        // expressible in this scale) and the display font-family on top of this token.
        stat: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

export default config;
