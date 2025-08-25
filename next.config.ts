import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during production builds so unrelated lint errors don't block CI
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
