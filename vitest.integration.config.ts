import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    globalSetup: ["./vitest.integration.globalSetup.ts"],
    setupFiles: ["./vitest.integration.setup.ts"],
    include: ["**/*.integration.test.ts"],
    testTimeout: 15000,
    fileParallelism: false,
  },
});
