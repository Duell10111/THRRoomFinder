import { useRoomContext } from "@/context/RoomContext"
import { Schedule } from "@/components/schedule/Schedule"
import { AppShell, Center, ScrollArea } from "@mantine/core"

/**
 * A component that displays room details and its schedule if a room is selected.
 *
 * - If no room is selected in context, shows a placeholder message.
 * - If a room is selected, displays the room name and its schedule (if available).
 *
 * Uses `useRoomContext` to access selected room and schedule data.
 *
 * @returns A section of the UI showing room details or a message prompting room selection.
 */
export function RoomDetails() {
    const { data } = useRoomContext()

    return (
        <AppShell.Section
            grow
            w={"100%"}
            component={data ? ScrollArea : undefined}
        >
            {!data ? (
                <Center
                    h={"100%"}
                    w={"100%"}
                    data-testid={"room-details-no-selection"}
                >
                    No room selected.
                </Center>
            ) : (
                <>
                    <Center
                        style={{ margin: "20px" }}
                        data-testid={"roomData-name"}
                    >
                        Name: {data?.roomData?.name}
                    </Center>
                    {data.scheduleData?.[data.roomData.name] ? (
                        <Schedule
                            date={data.date ?? new Date()}
                            schedule={data.scheduleData[data.roomData.name]}
                        />
                    ) : null}
                </>
            )}
        </AppShell.Section>
    )
}
