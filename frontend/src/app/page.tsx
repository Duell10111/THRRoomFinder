"use client"

import { RoomContextProvider } from "@/context/RoomContext"
import { HomeAppShell } from "@/sites/HomeAppShell"

export default function Home() {
    return (
        <RoomContextProvider>
            <HomeAppShell />
        </RoomContextProvider>
    )
}
