import { Popup, useMap } from "react-map-gl/maplibre"
import { useEffect, useState } from "react"
import { RoomPopup } from "@/components/RoomPopup"

import "./popup.css"
import { getRoomName } from "@/components/MapUtils"
import { useRoomContext } from "@/context/RoomContext"
import { getRoom } from "@/utils/data"

export function RoomClicker() {
    const { current } = useMap()
    const [popup, setPopup] = useState<{ lat: number; long: number }>()
    const [name, setName] = useState<string>()
    const { setRoomData } = useRoomContext()

    useEffect(() => {
        const map = current?.getMap()
        if (map && current) {
            map.on("click", "indoor-polygon", (e) => {
                // Fetch room name
                const roomName = getRoomName(e, current)
                if (roomName) {
                    setPopup({ lat: e.lngLat.lat, long: e.lngLat.lng })
                    setName(roomName)
                    getRoom(roomName)
                        .then((data) => {
                            if (data) setRoomData(data)
                        })
                        .catch(console.error)
                }
            })
        }
    }, [current, setRoomData])

    return (
        <>
            {popup && name ? (
                <Popup
                    latitude={popup.lat}
                    longitude={popup.long}
                    onClose={() => setPopup(undefined)}
                >
                    <RoomPopup roomName={name} buildingId={""} />
                </Popup>
            ) : null}
        </>
    )
}
