import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath for GitHub Pages deployment
  basePath: '/milch-maedchen-calculator',
  assetPrefix: '/milch-maedchen-calculator/',
};

export default nextConfig;
