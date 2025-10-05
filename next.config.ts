import type { NextConfig } from "next";

const SITE_ID = process.env.SITE_ID || ""; // Injected during build/export

const nextConfig: NextConfig = {
  // ✅ Enable static export for CDN deployment
  output: "export",

  // ✅ Disable image optimization (required for static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" }, // Allow all remote sources
    ],
  },

  // ✅ Ensure trailing slashes for static export (important for worker routing)
  trailingSlash: true,

  // ✅ React & SWC optimizations
  reactStrictMode: true,
  swcMinify: true,

  // ✅ Type & lint controls
  typescript: {
    ignoreBuildErrors: false, // Set true to speed builds in dev
  },
  eslint: {
    ignoreDuringBuilds: false, // Set true to skip lint in CI/CD
  },

  // ✅ Core static asset configuration
  // The Worker expects assets under /sites/[SITE_ID]/_next/
  assetPrefix: SITE_ID ? `/sites/${SITE_ID}` : "./",
  basePath: "",

  // ✅ Force Next.js Webpack output to align with CDN paths
  webpack: (config) => {
    if (SITE_ID) {
      config.output.publicPath = `/sites/${SITE_ID}/_next/`;
      console.log(`🧩 Next.js publicPath set to /sites/${SITE_ID}/_next/`);
    } else {
      console.warn("⚠️ SITE_ID not provided — using relative asset paths");
    }
    return config;
  },
};

export default nextConfig;
