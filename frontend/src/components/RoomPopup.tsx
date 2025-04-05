import useScheduleData from "@/hooks/useScheduleData";
import {ScheduleData} from "@/utils/data";
import {useMemo} from "react";

interface RoomPopupProps {
    roomName: string;
    buildingId: string;
}

export function RoomPopup({roomName, buildingId}: RoomPopupProps) {
    const data = useScheduleData(roomName);

    const next = useMemo(() => data ? findNextEntry(data) : undefined, [data])

    return (
        <>
            {
                data?.map(item => item.room)
            }
            {next ? (
                <div>
                    <h2>Nächste Veranstaltung</h2>
                    <p>{next.name}</p>
                    <p>Raum: {next.room}</p>
                    <p>Beginn: {new Date(next.startTime).toLocaleTimeString()}</p>
                </div>
            ) : (
                <p>Keine weiteren Termine heute.</p>
            )}
        </>
    );
}

function findNextEntry(schedule: ScheduleData[]): ScheduleData | null {
    const now = new Date();

    const upcoming = schedule
        .map(entry => ({
            ...entry,
            start: new Date(entry.startTime)
        }))
        .filter(entry => entry.start > now)
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    return upcoming.length > 0 ? upcoming[0] : null;
}
