import {useEffect, useState} from "react";
import {backendUrl} from "@/utils/const";
import {ScheduleData} from "@/utils/data";


export default function useScheduleData(roomName: string) {
    const [scheduleData, setScheduleData] = useState<ScheduleData[]>();

    useEffect(() => {
        async function fetchScheduleData() {
            const data = await fetch(`${backendUrl}/api/v1/room/${roomName}/schedule`)
            return await data.json() as ScheduleData[]
        }
        fetchScheduleData().then(setScheduleData).catch(console.warn)
    }, [roomName])

    return scheduleData;
}
