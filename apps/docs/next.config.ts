import { createMDX as withMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

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

export default withMDX()(config);
