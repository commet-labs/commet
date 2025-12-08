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
};

export default withMDX(config);
