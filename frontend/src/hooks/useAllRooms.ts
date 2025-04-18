import { useEffect, useState } from "react"
import { ExtendedRoomData, getAllRoomsWithBuildings } from "@/utils/data"
import _ from "lodash"

export default function useAllRooms() {
    const [rooms, setRooms] = useState<{
        [buildingName: string]: ExtendedRoomData[]
    }>({})

    useEffect(() => {
        getAllRoomsWithBuildings()
            .then((data) => {
                setRooms(_.groupBy(data, "buildingName"))
            })
            .catch(console.error)
    }, [])

    return rooms
}
