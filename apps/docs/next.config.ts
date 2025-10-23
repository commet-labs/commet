import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:lang/docs/:path*.mdx",
        destination: "/:lang/llms.mdx/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/es",
        destination: "/es/docs",
        permanent: true,
      },
      {
        source: "/pt",
        destination: "/pt/docs",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
