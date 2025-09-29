import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath for GitHub Pages deployment only in production
  ...(isProd && {
    basePath: '/milch-maedchen-calculator',
    assetPrefix: '/milch-maedchen-calculator/',
  }),
};

export default nextConfig;
