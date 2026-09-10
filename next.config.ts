import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true }, // pre-optimised WebP/AVIF in /public; static export has no image server
  experimental: { optimizePackageImports: [] },
};

export default nextConfig;
