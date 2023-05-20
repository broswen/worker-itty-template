import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "miniflare",
        environmentOptions: {
            bindings: {
                ENVIRONMENT: "miniflare"
            },
            kvNamespaces: ["KV"],
            // durableObjects: {
            //     COUNTER: "Counter"
            // }
        },
    },
})