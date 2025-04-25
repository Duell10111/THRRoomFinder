import { useMap } from "react-map-gl/maplibre"
import { useEffect } from "react"
import { useRoomContext } from "@/context/RoomContext"

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
