import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true }, // pre-optimised WebP/AVIF in /public; static export has no image server
  // Perf (ADR-0009): strip the React dev-only property, and let Next tree-shake
  // barrel imports from our own component barrels.
  compiler: { reactRemoveProperties: process.env.NODE_ENV === "production" },
  experimental: { optimizePackageImports: ["@/components/ui/glass", "@/components/ui/Icons"] },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
