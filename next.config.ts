import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    serverComponentsExternalPackages: ["pdf-to-img", "pdfjs-dist"],
  },
};

export default nextConfig;
