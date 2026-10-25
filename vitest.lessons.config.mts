import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Runs every lesson's solution and seed through the real runner (start it with `npm run runner`).
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.lessons.test.ts"], environment: "node", testTimeout: 60_000 },
});
