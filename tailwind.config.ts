import type { Config } from "tailwindcss";

/**
 * Design tokens — ADR-0002 "visual refresh". White ground, near-black ink and the
 * neutral grey scale stay; steel blue stays for links/primary CTAs. Added: the warm
 * `spark` laser accent (highlights, icons, badges, numbers, eyebrows, secondary CTAs),
 * tinted section backgrounds, a wider radius scale (up to 20px) and two card shadows.
 * Every pre-refresh token name (ink, grey, steel, font-sans, font-display, max-w-site)
 * keeps working so already-built pages keep compiling.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem", xl: "2rem" }, screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#111214", soft: "#2B2D31" },
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
        steel: { DEFAULT: "#1F4E79", hover: "#173B5C", soft: "#E8EEF5" },
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
      boxShadow: {
        card: "0 1px 2px rgba(17,18,20,.06), 0 8px 24px rgba(17,18,20,.08)",
        "card-hover": "0 2px 6px rgba(17,18,20,.08), 0 20px 36px rgba(17,18,20,.14)",
      },
      maxWidth: { site: "1280px", prose: "72ch" },
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
