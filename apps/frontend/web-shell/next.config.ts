import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Point at the pnpm workspace root (not this package's own folder): pnpm
    // resolves hoisted deps like `next` via symlinks into the root
    // node_modules/.pnpm store, which sits outside apps/frontend/web-shell,
    // so Turbopack's root must include it or module resolution fails.
    root: path.resolve(__dirname, "../../.."),
  },
};

export default nextConfig;
