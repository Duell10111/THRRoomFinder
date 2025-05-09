import { useRoomContext } from "@/context/RoomContext"
import { Schedule } from "@/components/schedule/Schedule"
import { AppShell, Center, ScrollArea } from "@mantine/core"

export function RoomDetails() {
    const { data } = useRoomContext()

    return (
        <AppShell.Section
            grow
            w={"100%"}
            component={data ? ScrollArea : undefined}
        >
            {!data ? (
                <Center h={"100%"} w={"100%"}>
                    No room selected.
                </Center>
            ) : (
                <>
                    <Center style={{ margin: "20px" }}>
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
