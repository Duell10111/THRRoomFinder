import { useEffect, useState } from "react"
import { fetchScheduleData, ScheduleData } from "@/utils/data"

/**
 * Custom React hook to fetch and return the schedule data for a given room.
 *
 * Automatically re-fetches whenever the room name changes.
 *
 * @param roomName - The name of the room whose schedule should be retrieved.
 * @returns An array of ScheduleData objects or undefined while loading.
 */
export default function useScheduleData(roomName: string) {
    const [scheduleData, setScheduleData] = useState<ScheduleData[]>()

    useEffect(() => {
        fetchScheduleData(roomName).then(setScheduleData).catch(console.warn)
    }, [roomName])

    return scheduleData
}
