"use client"

import Map, { FullscreenControl, GeolocateControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import "maplibre-gl-indoorequal/maplibre-gl-indoorequal.css"
import { IndoorControls } from "@/components/map/IndoorControls"
import { RoomClicker } from "@/components/map/RoomClicker"
import { useColorScheme } from "@mantine/hooks"
import { useRoomContext } from "@/context/RoomContext"

import "./map.css"
import OccupancyControl from "@/components/map/OccupancyControl"

export function CampusMap() {
    const colorScheme = useColorScheme("dark")
    const { onMapLoad } = useRoomContext()

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
            onLoad={(event) => {
                const map = event.target
                map.addSource("highlight-room", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                })
                map.addSource("occupancy-room", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                    promoteId: "roomName",
                })
                onMapLoad?.()
            }}
        >
            <IndoorControls />
            <OccupancyControl />
            <RoomClicker />
            <GeolocateControl />
            <FullscreenControl />
        </Map>
    )
}
