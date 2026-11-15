import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Three Fiber ships three's ES modules; the R3F docs ask Next to transpile them.
  transpilePackages: ["three"],
};

export default nextConfig;
