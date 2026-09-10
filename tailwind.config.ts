import type { Config } from "tailwindcss";

/**
 * Design tokens — ADR-0004 "teal brand palette with subtle gradients" (supersedes the
 * ADR-0002 steel blue palette). White ground, the neutral grey scale and the warm
 * `spark` accent stay; steel blue is replaced by `teal` as the primary everywhere.
 * The `steel` token name is kept as an alias pointing at the teal values so every
 * pre-existing `steel`/`steel-hover`/`steel-soft` class keeps compiling but now renders
 * teal. `ink` moves to a slightly teal-tinted near-black. Added: gradient
 * `backgroundImage` tokens for the dark/soft bands and the primary/spark buttons, a
 * teal-soft panel gradient, and teal-tinted card shadows.
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
        // Alias — every pre-existing `steel`/`steel-hover`/`steel-soft` class now renders teal.
        steel: { DEFAULT: "#0F766E", hover: "#0B5C56", soft: "#E6F4F2" },
        spark: { DEFAULT: "#F26A21", hover: "#D65A17", soft: "#FFF1EA" },
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
        full: "9999px",
      },
      backgroundImage: {
        "band-dark": "linear-gradient(135deg, #0F1A1A 0%, #0B3B38 55%, #0F766E 130%)",
        "band-soft": "linear-gradient(180deg, #F2FAF9 0%, #FFFFFF 100%)",
        "btn-primary": "linear-gradient(180deg, #14857C, #0F766E)",
        "btn-spark": "linear-gradient(180deg, #F5772F, #F26A21)",
        "panel-soft": "linear-gradient(180deg, #E6F4F2 0%, #FFFFFF 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(8,20,19,.07), 0 8px 24px rgba(15,118,110,.10)",
        "card-hover": "0 2px 6px rgba(8,20,19,.10), 0 20px 36px rgba(15,118,110,.16)",
      },
      maxWidth: { site: "1720px", prose: "72ch" },
      spacing: { 18: "4.5rem", 22: "5.5rem" },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [],
};

export default config;
