import type { Config } from "tailwindcss";

/**
 * Design tokens — ADR-0005 "Liquid Glass" (supersedes ADR-0002, ADR-0004). Calm,
 * near-white canvas; frosted glass surfaces; pill shapes; one accent (teal). The
 * `spark` (orange) token stays defined so any stray legacy class still compiles,
 * but nothing in the design system renders it — see app/globals.css. `steel` stays
 * as an alias of `teal` for the same reason. `ink`/`grey` are the neutral scale.
 * `display-xl`/`display-lg` (H1) and `display-md` (H2) now carry the ADR §3 type
 * scale, so every existing `text-display-*` class site-wide picks up the new
 * proportions without page-level edits.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem", xl: "2rem" }, screens: { "2xl": "1720px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#0F1A1A", soft: "#2B2D31" },
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
      },
      maxWidth: { site: "1720px", content: "1200px", prose: "66ch" },
      spacing: { 18: "4.5rem", 22: "5.5rem" },
      fontSize: {
        // ADR-0006 §Polish — H1 letter-spacing tightened to -0.035em (was -0.03em, ADR-0005 §3).
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        // ADR-0005 §3 H2 — clamp(1.9rem, 3.4vw, 2.75rem), ls -0.02em.
        "display-md": ["clamp(1.9rem, 3.4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        // ADR-0006 §Polish — eyebrow 11.5px, tracking .16em (was 12px/.14em, ADR-0005 §3).
        eyebrow: ["0.71875rem", { lineHeight: "1.3", letterSpacing: "0.16em" }],
      },
    },
  },
  plugins: [],
};

export default config;
