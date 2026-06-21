import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bookstore/config", "@bookstore/db", "@bookstore/ui"],
};

export default nextConfig;
