import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "projects-2025-a3dd7.firebasestorage.app",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.firebasestorage.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
