import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // /api/run reads lessons (hidden checks, test definitions) from disk at request time,
  // so the markdown must ship with the serverless function.
  outputFileTracingIncludes: {
    "/api/run": ["./content/**/*"],
  },
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
