import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".claude/**", ".claude-flow/**", ".agents/**", "out/**", "scripts/**"] },
  // Prose-heavy site: apostrophes/quotes in JSX text are intentional and safe.
  { rules: { "react/no-unescaped-entities": "off" } },
];
export default eslintConfig;
