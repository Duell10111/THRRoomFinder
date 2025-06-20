import { Popup, useMap } from "react-map-gl/maplibre"
import { useEffect, useState } from "react"
import { RoomPopup } from "@/components/map/RoomPopup"

import "./popup.css"
import { getRoomName } from "@/components/map/MapUtils"
import { useRoomContext } from "@/context/RoomContext"
import { GeoJSONSource } from "maplibre-gl"
import { showErrorNotification } from "@/utils/notifications"

export function RoomClicker() {
    const { current } = useMap()
    const [popup, setPopup] = useState<{ lat: number; lng: number }>()
    const { setRoom, data, level } = useRoomContext()

    useEffect(() => {
        const map = current?.getMap()
        if (map && current) {
            map.on("click", "indoor-polygon", (e) => {
                const feature = e.features?.[0]

                // Fetch room name
                const roomName = getRoomName(e, current)
                if (roomName) {
                    setPopup({ lat: e.lngLat.lat, lng: e.lngLat.lng })
                    setRoom(roomName).catch((error) => {
                        console.error(error)
                        showErrorNotification({
                            title: "Could not fetch room data, please try again later",
                            message: error.message,
                        })
                        // Close popup on error
                        setPopup(undefined)
                    })

                    if (feature) {
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
