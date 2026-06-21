import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bookstore/db", "@bookstore/ui"],
};

export default nextConfig;
