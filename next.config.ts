import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath if your repo name is not the domain
  // basePath: '/milch-maedchen-calculator',
  // assetPrefix: '/milch-maedchen-calculator/',
};

export default nextConfig;
