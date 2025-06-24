import { useEffect, useState } from "react"
import { ExtendedRoomData, getAllRoomsWithBuildings } from "@/utils/data"
import _ from "lodash"

/**
 * Custom React hook that fetches all rooms with building information and groups them by building name.
 *
 * Uses the `getAllRoomsWithBuildings` utility function and groups the result using Lodash.
 *
 * @returns An object where each key is a building name and the value is an array of ExtendedRoomData.
 */
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
