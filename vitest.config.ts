import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "miniflare",
    environmentOptions: {
      bindings: {
        ENVIRONMENT: "miniflare",
        JWT_SECRET: "secret"
      },
      kvNamespaces: ["KV", "AUTH"],
      // durableObjects: {
      //     COUNTER: "Counter"
      // }
    },
  },
});
