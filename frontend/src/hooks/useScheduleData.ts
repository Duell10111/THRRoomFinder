import { useEffect, useState } from "react"
import { fetchScheduleData, ScheduleData } from "@/utils/data"

export default function useScheduleData(roomName: string) {
    const [scheduleData, setScheduleData] = useState<ScheduleData[]>()

    useEffect(() => {
        fetchScheduleData(roomName).then(setScheduleData).catch(console.warn)
    }, [roomName])

    return scheduleData
}
