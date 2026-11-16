import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents + partialPrefetching hang/500 on Cloudflare Workers
  // (Error 1101) — keep off until OpenNext workerd support is solid.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
