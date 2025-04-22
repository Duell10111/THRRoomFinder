import { expect, describe, it, vi, Mock } from "vitest"
import { render, screen } from "./test-utils"
import { useRoomContext } from "@/context/RoomContext"
import { RoomDetails } from "@/sites/RoomDetails"
import { AppShell } from "@mantine/core"

// Mock the useRoomContext hook
vi.mock("@/context/RoomContext", () => ({
    useRoomContext: vi.fn(),
}))

describe("RoomDetails", () => {
    it("shows 'No room selected.' when no data is available", () => {
        ;(useRoomContext as Mock).mockReturnValue({ data: null })
        render(
            <AppShell>
                <RoomDetails />
            </AppShell>
        )
        expect(screen.getByText("No room selected.")).toBeDefined()
    })

    it("renders room name when data is available", () => {
        ;(useRoomContext as Mock).mockReturnValue({
            data: {
                roomData: { name: "Room A" },
                date: new Date("2023-01-01"),
                scheduleData: [],
            },
        })

        render(
            <AppShell>
                <RoomDetails />
            </AppShell>
        )
        expect(screen.getByText("Name: Room A")).toBeDefined()
        expect(screen.getByText("01.01.2023")).toBeDefined()
    })

    it("renders Schedule component when scheduleData is provided", () => {
        const scheduleData = [
            {
                location: "RO",
                room: "Room B",
                name: "Grundlagen der Bauphysik",
                lecturer: "Praktikum, Prof.Dr. Johannes Aschaber",
                relevantDegrees: "IPB-B2",
                startTime: "2025-04-07T11:45:00",
                endTime: "2025-04-07T13:15:00",
            },
        ]

        ;(useRoomContext as Mock).mockReturnValue({
            data: {
                roomData: { name: "Room B" },
                date: new Date("2025-04-07"),
                scheduleData,
            },
        })

        render(
            <AppShell>
                <RoomDetails />
            </AppShell>
        )
        expect(screen.getByText("Name: Room B")).toBeDefined()
        expect(screen.getByText("07.04.2025")).toBeDefined()
        expect(screen.getByText("Grundlagen der Bauphysik")).toBeDefined()
        // We assume the Schedule component renders some known content based on scheduleData
    })
})
