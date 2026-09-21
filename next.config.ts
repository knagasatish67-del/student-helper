import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcryptjs", "jsonwebtoken", "multer"],
  allowedDevOrigins: [
    "*.run.app",
    "ais-dev-clvpp2dd66gi3wb6mw4abz-143540535557.asia-east1.run.app",
    "ais-pre-clvpp2dd66gi3wb6mw4abz-143540535557.asia-east1.run.app",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
  async redirects() {
    return [
      {
        source: "/admin/dash%20board",
        destination: "/admin/dashboard",
        permanent: false,
      },
      {
        source: "/admin/dash board",
        destination: "/admin/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
