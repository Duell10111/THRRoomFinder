import { ScheduleData } from "@/utils/data"
import { useMemo } from "react"
import { Card, Group, Loader, Text, Title } from "@mantine/core"
import { useRoomContext } from "@/context/RoomContext"
import { format, parseISO } from "date-fns"
import { IconCalendarEvent } from "@tabler/icons-react"

interface RoomPopupProps {
    roomName: string
}

export function RoomPopup({ roomName }: RoomPopupProps) {
    const { data } = useRoomContext()

    const next = useMemo(
        () =>
            data?.scheduleData?.[roomName]
                ? findNextEntry(data.scheduleData[roomName])
                : undefined,
        [data, roomName]
    )

    return (
        <Card shadow="md" padding="sm" radius="md">
            {/* Loading data */}
            {next === undefined ? (
                <Loader size={"xs"} data-testid={"loader-room-popup"} />
            ) : next ? (
                <>
                    <Group gap={"xs"} mb={"xs"}>
                        <IconCalendarEvent size={20} />
                        <Title order={5}>Nächste Veranstaltung</Title>
                    </Group>
                    <Text size="sm">{next.name}</Text>
                    <Text size="sm" c="dimmed">
                        Beginn:{" "}
                        {format(parseISO(next.startTime), "HH:mm - dd.MM.y")}
                    </Text>
                </>
            ) : (
                <Text size="sm" ta={"center"}>
                    Keine weiteren Termine diese Woche.
                </Text>
            )}
        </Card>
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
