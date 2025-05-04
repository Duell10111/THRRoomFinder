import { expect, test, vi } from "vitest"
import { render, screen } from "../../test-utils"
import { RoomPopup } from "@/components/map/RoomPopup"
import { waitFor, waitForElementToBeRemoved } from "@testing-library/react"

const { useRoomContext } = vi.hoisted(() => {
    const useRoomContext = vi.fn(() => ({}))

    return { useRoomContext }
})

vi.mock("@/context/RoomContext", async () => {
    return {
        useRoomContext,
    }
})

describe("RoomPopup", () => {
    it("Loading", () => {
        render(<RoomPopup roomName={"A0.03"} />)
        expect(screen.getByTestId("loader-room-popup")).toBeDefined()
    })

    // it("Schedule Data", async () => {
    //     useRoomContext.mockReturnValueOnce(() => {
    //         return {
    //             roomData: {
    //                 name: "A0.03",
    //                 buildingName: "Building 1",
    //                 location: {
    //                     lat: 52.520008,
    //                     lng: 13.404954,
    //                 },
    //             },
    //             scheduleData: [
    //                 {
    //                     location: "RO",
    //                     room: "A0.03",
    //                     name: "Test",
    //                     lecturer: "",
    //                     relevantDegrees: "",
    //                     startTime: "2025-05-05T11:45:00",
    //                     endTime: "2025-05-05T14:45:00",
    //                 },
    //             ],
    //         }
    //     })
    //     render(<RoomPopup roomName={"A0.03"} />)
    //     expect(screen.getByTestId("loader-room-popup")).toBeDefined()
    //     await waitForElementToBeRemoved(screen.getByTestId("loader-room-popup"))
    // })
})

// TODO: Add more tests
