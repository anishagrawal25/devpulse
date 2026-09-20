import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com", "api.dicebear.com"],
  },
};

export default nextConfig;
