import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
