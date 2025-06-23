import { ScheduleData } from "@/utils/data"
import { useMemo } from "react"
import { Card, Group, Loader, Text, Title } from "@mantine/core"
import { useRoomContext } from "@/context/RoomContext"
import { format, parseISO } from "date-fns"
import { IconCalendarEvent } from "@tabler/icons-react"

/**
 * Props for the RoomPopup component.
 *
 * @property roomName - The name of the room for which to show the next scheduled event.
 */
interface RoomPopupProps {
    roomName: string
}

/**
 * Displays a popup with the next scheduled event for a specific room.
 *
 * Uses room context to retrieve schedule data and renders a card with details about the upcoming event.
 * Shows a loader while data is being fetched and a fallback message if no events are found.
 *
 * @param props - Contains the room name to display the popup for.
 * @returns A card displaying the next event or a fallback message.
 */
export function RoomPopup({ roomName }: Readonly<RoomPopupProps>) {
    const { data } = useRoomContext()

    const next = useMemo(
        () =>
            data?.scheduleData?.[roomName]
                ? findNextEntry(data.scheduleData[roomName])
                : undefined,
        [data, roomName]
    )

    /* Loading data */
    if (next === undefined)
        return (
            <Card shadow="md" padding="sm" radius="md">
                <Loader size={"xs"} data-testid={"loader-room-popup"} />
            </Card>
        )

    return (
        <Card shadow="md" padding="sm" radius="md">
            {next ? (
                <>
                    <Group gap={"xs"} mb={"xs"}>
                        <IconCalendarEvent size={20} />
                        <Title order={5}>Nächste Veranstaltung</Title>
                    </Group>
                    <Text size="sm">{`🗓️ ${next.name}`}</Text>
                    <Text size="sm" c="dimmed">
                        🕖 Beginn:{" "}
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

/**
 * Finds the next upcoming schedule entry from a list of schedule data.
 *
 * Filters and sorts the schedule entries to find the next one after the current time.
 *
 * @param schedule - The list of scheduled events for a room.
 * @returns The next upcoming event or null if none remain.
 */
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
