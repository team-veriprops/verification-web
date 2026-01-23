import { serverConfig } from "./src/lib/config/server";
import { publicConfig } from "./src/lib/config/public";
import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["127.0.0.1", "192.168.0.132"],
  async rewrites() {
    return [
      {
        source: `${publicConfig.apiUrl}/:path*`,  // All calls to /api/* on Next.js
        destination: `${serverConfig.backendApi}/api/:path*`,
        // Replace with your FastAPI backend (dev/prod)
      },
    ];
  },
};

export default nextConfig;
