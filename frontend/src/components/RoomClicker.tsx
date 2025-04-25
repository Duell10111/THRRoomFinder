import { Popup, useMap, Marker } from "react-map-gl/maplibre"
import { useEffect, useState } from "react"
import { RoomPopup } from "@/components/RoomPopup"

import "./popup.css"
import { getRoomName } from "@/components/MapUtils"
import { useRoomContext } from "@/context/RoomContext"
import { GeoJSONSource } from "maplibre-gl"

export function RoomClicker() {
    const { current } = useMap()
    const [popup, setPopup] = useState<{ lat: number; lng: number }>()
    const { setRoom, data } = useRoomContext()

    useEffect(() => {
        const map = current?.getMap()
        if (map && current) {
            map.on("click", "indoor-polygon", (e) => {
                const feature = e.features?.[0]

                console.log(map.getStyle().sources) // Zeigt alle Quellen
                console.log(map.getStyle().layers) // Zeigt alle Layer

                // Fetch room name
                const roomName = getRoomName(e, current)
                if (roomName) {
                    setPopup({ lat: e.lngLat.lat, lng: e.lngLat.lng })
                    setRoom(roomName).catch(console.error)

                    if (feature) {
                        console.log("Feature: ", feature)
                        const source = map.getSource(
                            "highlight-room"
                        ) as GeoJSONSource
                        source.setData({
                            type: "FeatureCollection",
                            features: [feature],
                        })
                    }
                }
            })
        }
    }, [current, setRoom])

    return (
        <>
            {popup ? (
                <Popup
                    latitude={popup.lat}
                    longitude={popup.lng}
                    onClose={() => setPopup(undefined)}
                >
                    <RoomPopup roomName={data?.roomData?.name ?? ""} />
                </Popup>
            ) : null}
            {/* If  */}
            {!popup && data?.roomData ? (
                <Marker
                    latitude={data.roomData.location.lat}
                    longitude={data.roomData.location.lng}
                ></Marker>
            ) : null}
        </>
    )
}
