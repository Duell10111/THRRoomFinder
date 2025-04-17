"use client"

import Map, { FullscreenControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import "maplibre-gl-indoorequal/maplibre-gl-indoorequal.css"
import { IndoorControls } from "@/components/IndoorControls"
import { RoomClicker } from "@/components/RoomClicker"

import "./map.css"
import { useColorScheme } from "@mantine/hooks"

export function CampusMap() {
    const colorScheme = useColorScheme("dark")

    return (
        <Map
            id="campus"
            initialViewState={{
                longitude: 12.107220832011787,
                latitude: 47.86746398383466,
                zoom: 18,
            }}
            // Restricted Bounds to RO site location
            maxBounds={[
                [12.103541, 47.865018],
                [12.111059, 47.869857],
            ]}
            style={{ width: "100%", height: "100%" }}
            mapStyle={
                colorScheme === "dark"
                    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                    : `https://api.maptiler.com/maps/openstreetmap/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
            }
            attributionControl={{ compact: true }}
        >
            <IndoorControls />
            <RoomClicker />
            <FullscreenControl />
        </Map>
    )
}
