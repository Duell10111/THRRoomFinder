import { Popup, useMap } from "react-map-gl/maplibre"
import { useEffect, useState } from "react"
import { RoomPopup } from "@/components/map/RoomPopup"

import "./popup.css"
import { getRoomName } from "@/components/map/MapUtils"
import { useRoomContext } from "@/context/RoomContext"
import { GeoJSONSource } from "maplibre-gl"

export function RoomClicker() {
    const { current } = useMap()
    const [popup, setPopup] = useState<{ lat: number; lng: number }>()
    const { setRoom, data, level } = useRoomContext()

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

    // TODO: Change to show highlight even if not selected by clicking on map
    useEffect(() => {
        if (data && !popup) {
            const source = current
                ?.getMap()
                ?.getSource("highlight-room") as GeoJSONSource
            source?.setData({
                type: "FeatureCollection",
                features: [],
            })
        }
    }, [current, data, popup])

    // Hide popup when level changes
    useEffect(() => {
        if (level) {
            setPopup(undefined)
        }
    }, [level])

    return (
        <>
            {popup ? (
                <Popup
                    latitude={popup.lat}
                    longitude={popup.lng}
                    onClose={() => setPopup(undefined)}
                    closeButton={false}
                >
                    <RoomPopup roomName={data?.roomData?.name ?? ""} />
                </Popup>
            ) : null}
        </>
    )
}
