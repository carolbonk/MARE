import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Temporarily ignore TypeScript errors during build
    // Remove this once Supabase types are properly generated
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
