import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compress: true,
  poweredByHeader: false,
  
  // Enable experimental features for better optimization
  experimental: {
    optimizePackageImports: ["@radix-ui"],
  },
  
  // Turbopack configuration for code splitting and optimization
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },
  
  // Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // SWC configuration for minification and optimization
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Headers for better performance and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        has: [{ type: "query", key: "v" }],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
