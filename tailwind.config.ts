import type { Config } from "tailwindcss";

/**
 * Design tokens — deliberately small. White ground, near-black ink, one neutral
 * grey scale, one steel-blue accent (links, CTAs, small highlights only).
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
      },
      fontFamily: {
        sans: ["var(--font-ui)", "ui-sans-serif", "sans-serif"],
        display: ["var(--font-display)", "var(--font-ui)", "sans-serif"],
      },
      borderRadius: { none: "0", sm: "2px", DEFAULT: "3px", md: "4px", lg: "4px", xl: "4px", "2xl": "4px", full: "9999px" },
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
