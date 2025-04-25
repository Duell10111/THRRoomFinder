"use client"

import { RoomContextProvider } from "@/context/RoomContext"
import { HomeAppShell } from "@/sites/HomeAppShell"
import { MapProvider } from "react-map-gl/maplibre"

export default function Home({
    params,
}: {
    params: Promise<{ slug?: string[] }>
}) {
    return (
        <MapProvider>
            <RoomContextProvider homeParams={params}>
                <HomeAppShell />
            </RoomContextProvider>
        </MapProvider>
    )
}
