import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import * as path from "node:path"

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./vitest.setup.mts"],
        coverage: {
            reporter: ["text", "lcov"],
        },
        clearMocks: true,
        server: {
            deps: {
                // Package declares "type": "module" but ships its CJS build as .js, so let Vite transform its ESM build
                inline: ["maplibre-gl-indoorequal"],
            },
        },
        alias: {
            "@mapgrab/map-interface": path.resolve(
                __dirname,
                "src/__mocks__/mabgrab-interface.ts"
            ),
        },
    },
})
