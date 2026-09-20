import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com", "api.dicebear.com"],
  },
};

export default nextConfig;
