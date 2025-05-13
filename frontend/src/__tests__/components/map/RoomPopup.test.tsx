import { expect, vi } from "vitest"
import { render, screen } from "../../test-utils"
import { RoomPopup } from "@/components/map/RoomPopup"
import { addHours } from "date-fns"

const { useRoomContext } = vi.hoisted(() => {
    const useRoomContext = vi.fn(() => ({}))

    return { useRoomContext }
})

vi.mock("@/context/RoomContext", () => {
    return {
        useRoomContext,
    }
})

describe("RoomPopup", () => {
    it("Loading", () => {
        render(<RoomPopup roomName={"A0.03"} />)
        expect(screen.getByTestId("loader-room-popup")).toBeDefined()
    })

    it("Schedule Data - No next entry", async () => {
        useRoomContext.mockReturnValue({
            data: {
                roomData: {
                    name: "A0.03",
                    buildingName: "Building 1",
                    location: {
                        lat: 52.520008,
                        lng: 13.404954,
                    },
                },
                scheduleData: {
                    "A0.03": [
                        {
                            location: "RO",
                            room: "A0.03",
                            name: "Test",
                            lecturer: "",
                            relevantDegrees: "",
                            startTime: "2025-05-05T11:45:00",
                            endTime: "2025-05-05T14:45:00",
                        },
                    ],
                },
            },
        })

        render(<RoomPopup roomName={"A0.03"} />)
        expect(
            screen.getByText("Keine weiteren Termine diese Woche.")
        ).toBeDefined()
    })

    it("Schedule Data - With next entry", async () => {
        useRoomContext.mockReturnValue({
            data: {
                roomData: {
                    name: "A0.03",
                    buildingName: "Building 1",
                    location: {
                        lat: 52.520008,
                        lng: 13.404954,
                    },
                },
                scheduleData: {
                    "A0.03": [
                        {
                            location: "RO",
                            room: "A0.03",
                            name: "Test",
                            lecturer: "",
                            relevantDegrees: "",
                            startTime: addHours(new Date(), 1).toISOString(),
                            endTime: addHours(new Date(), 2).toISOString(),
                        },
                    ],
                },
            },
        })

        render(<RoomPopup roomName={"A0.03"} />)
        expect(screen.getByText("Nächste Veranstaltung")).toBeDefined()
    })
})

// TODO: Add more tests
