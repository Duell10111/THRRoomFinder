import { ScheduleData } from "@/utils/data"
import { useMemo } from "react"
import { Loader } from "@mantine/core"
import { useRoomContext } from "@/context/RoomContext"

interface RoomPopupProps {
    roomName: string
}

export function RoomPopup({ roomName }: RoomPopupProps) {
    const { data } = useRoomContext()

    const next = useMemo(
        () =>
            data?.scheduleData && data.roomData.name === roomName
                ? findNextEntry(data.scheduleData)
                : undefined,
        [data, roomName]
    )

    // Loading data
    if (next === undefined) {
        return (
            <>
                <Loader size={"xs"} data-testid={"loader-room-popup"} />
            </>
        )
    }

    return (
        <>
            {next ? (
                <div>
                    <h2>Nächste Veranstaltung</h2>
                    <p>{next.name}</p>
                    <p>Raum: {next.room}</p>
                    <p>
                        Beginn: {new Date(next.startTime).toLocaleTimeString()}
                    </p>
                </div>
            ) : (
                <p>Keine weiteren Termine heute.</p>
            )}
        </>
    )
}

function findNextEntry(schedule: ScheduleData[]): ScheduleData | null {
    const now = new Date()

    const upcoming = schedule
        .map((entry) => ({
            ...entry,
            start: new Date(entry.startTime),
        }))
        .filter((entry) => entry.start > now)
        .sort((a, b) => a.start.getTime() - b.start.getTime())

    return upcoming.length > 0 ? upcoming[0] : null
}
