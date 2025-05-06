"use client"

import { RoomContextProvider } from "@/context/RoomContext"
import { MapProvider } from "react-map-gl/maplibre"
import { MapPage } from "@/sites/MapPage"
import { NavAppShell } from "@/navigation/NavAppShell"

export default function Home({
    params,
}: {
    params: Promise<{ slug?: string[] }>
}) {
    return (
        <MapProvider>
            <RoomContextProvider homeParams={params}>
                <NavAppShell>
                    <MapPage />
                </NavAppShell>
            </RoomContextProvider>
        </MapProvider>
    )
}
