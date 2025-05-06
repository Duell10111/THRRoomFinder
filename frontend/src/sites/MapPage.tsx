import { Container, Space } from "@mantine/core"
import { CampusMap } from "@/components/map/CampusMap"
import useRoomInput from "@/hooks/useRoomInput"
import { AutocompleteSubmit } from "@/components/AutocompleteSubmit"

export function MapPage() {
    const { jumpToRoom } = useRoomInput()

    return (
        <>
            <Container>
                <AutocompleteSubmit
                    label="Pick your room"
                    placeholder="Pick room or enter anything"
                    onSubmit={(text) => {
                        jumpToRoom(text)
                            .then(() => console.log("Click"))
                            .catch(console.error)
                    }}
                />
            </Container>
            <Space h="xs" />
            <Container style={{ height: "80dvh" }}>
                <CampusMap />
            </Container>
        </>
    )
}
