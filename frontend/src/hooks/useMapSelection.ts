import { useMap } from "react-map-gl/maplibre"
import { useEffect } from "react"
import { useRoomContext } from "@/context/RoomContext"

/**
 * Custom React hook that updates the indoor map styling based on selected room data.
 *
 * When a room is selected, the corresponding polygon on the map is highlighted in red.
 * Uses feature state from MapLibre GL to toggle the fill color of indoor polygons.
 *
 * Dependencies:
 * - MapLibre GL map instance via `useMap`
 * - Room data via `useRoomContext`
 */
export default function useMapSelection() {
    const { campus } = useMap()
    const { data } = useRoomContext()

    useEffect(() => {
        if (data?.roomData && campus)
            campus.getMap().setPaintProperty("indoor-polygon", "fill-color", [
                "case",
                ["boolean", ["feature-state", "clicked"], false],
                "#ff0000", // Farbe wenn geklickt
                "#fdfcfa", // Normale Farbe
            ])
    }, [campus, data?.roomData])
}
