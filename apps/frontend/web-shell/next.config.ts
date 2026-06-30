import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Declare the project root explicitly to suppress the multi-lockfile warning.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
