import {Autocomplete, Container, Space} from "@mantine/core";
import {CampusMap} from "@/components/CampusMap";
import useRoomInput from "@/hooks/useRoomInput";

export function MapPage() {
    const {jumpToRoom} = useRoomInput()

    return (
        <>
            <Container>
                <Autocomplete
                    label="Pick your room"
                    placeholder="Pick room or enter anything"
                    // onSubmit={(text) => console.log(text)}
                    // onChange={console.log}
                    // onOptionSubmit={(option) => {
                    //     console.log(option);
                    //     jumpToRoom(option).then(() => console.log("Click")).catch(console.error)
                    // }}
                />
            </Container>
            <Space h="xs" />
            <Container style={{height: "80dvh"}}>
                <CampusMap />
            </Container>
        </>
    );
}
