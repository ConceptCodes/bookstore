import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bookstore/db", "@bookstore/ui"],
};

export default withEve(nextConfig, {
  eveRoot: "../../packages/eve",
});
