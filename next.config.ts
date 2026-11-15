import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Three Fiber ships three's ES modules; the R3F docs ask Next to transpile them.
  transpilePackages: ["three"],
  // The pamphlet's offline worker must never be cached itself, or a fix would take days to reach phones.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
