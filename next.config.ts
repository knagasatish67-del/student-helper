import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs", "jsonwebtoken", "multer"],
};

export default nextConfig;
