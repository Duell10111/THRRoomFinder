import {useRoomContext} from "@/context/RoomContext";
import {Schedule} from "@/components/schedule/Schedule";
import {Center, ScrollArea} from "@mantine/core";

export function RoomDetails() {
    const {data} = useRoomContext()

    console.log(data)

    if(!data){
        return (
            <Center inline={true} h={"100%"}>
                No room selected.
            </Center>
        )
    }

    return (
        <>
            <Center style={{margin: "20px"}}>
                Name: {data?.roomData?.name}
            </Center>
            {
                data?.scheduleData ? (
                    <ScrollArea>
                        <Schedule date={new Date()} schedule={data?.scheduleData} />
                    </ScrollArea>
                ) : null
            }
        </>
    );
}
