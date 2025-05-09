import { Container, Space } from "@mantine/core"
import { CampusMap } from "@/components/map/CampusMap"
import { AutocompleteSubmit } from "@/components/AutocompleteSubmit"
import { useRoomContext } from "@/context/RoomContext"

export function MapPage() {
    const { setRoom } = useRoomContext()

    return (
        <>
            <Container>
                <AutocompleteSubmit
                    label="Pick your room"
                    placeholder="Pick room or enter anything"
                    onSubmit={(text) => {
                        setRoom(text, true).catch(console.error)
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
