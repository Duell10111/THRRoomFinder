import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    distDir:
        process.env.NEXT_PUBLIC_TEST_ENV === "true" ? ".next-e2e" : ".next",
    output: "standalone",
    turbopack: {
        resolveAlias: {
            // Package points its "browser" field to a UMD build without exports, use its ESM build instead
            "maplibre-gl-indoorequal":
                "maplibre-gl-indoorequal/dist/maplibre-gl-indoorequal.esm.js",
        },
    },
}

export default nextConfig
