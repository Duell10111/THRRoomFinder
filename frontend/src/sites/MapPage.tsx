import { Container, Space } from "@mantine/core"
import { CampusMap } from "@/components/map/CampusMap"
import { AutocompleteSubmit } from "@/components/AutocompleteSubmit"
import { useRoomContext } from "@/context/RoomContext"

/**
 * A page component that displays the main interactive map and room search input.
 *
 * - Includes an autocomplete input allowing users to search for a room by name.
 * - Submitting a room triggers the RoomContext to update the selected room.
 * - Renders the CampusMap component, which visualizes indoor features and room status.
 *
 * @returns The full layout including the search bar and the map view.
 */
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
            <Container h={{ base: "82dvh", sm: "80dvh" }}>
                <CampusMap />
            </Container>
        </>
    )
}
