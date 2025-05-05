import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, vi, beforeEach, expect } from "vitest"
import { RoomClicker } from "@/components/map/RoomClicker"

// // Mock RoomPopup
// vi.mock("@/components/map/RoomPopup", () => ({
//     RoomPopup: ({ roomName }: { roomName: string }) => (
//         <div>{`Room: ${roomName}`}</div>
//     ),
// }))

// Mock Map instance and useMap
const mockMap = {
    on: vi.fn(),
    getMap: () => mockMap,
    getStyle: () => ({
        sources: {},
        layers: [],
    }),
    getSource: vi.fn().mockReturnValue({
        setData: vi.fn(),
    }),
}

vi.mock("react-map-gl/maplibre", async () => {
    return {
        useMap: () => ({ current: mockMap }),
        Popup: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
    }
})

// Mock RoomContext
const setRoom = vi.fn().mockResolvedValue(undefined)
const mockRoomData = { roomData: { name: "Test Room" } }

vi.mock("@/context/RoomContext", () => ({
    useRoomContext: () => ({
        setRoom,
        data: mockRoomData,
    }),
}))

describe("RoomClicker", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders without crashing", () => {
        render(<RoomClicker />)
    })

    it("attaches click listener to map on indoor-polygon layer", () => {
        render(<RoomClicker />)
        expect(mockMap.on).toHaveBeenCalledWith(
            "click",
            "indoor-polygon",
            expect.any(Function)
        )
    })

    // TODO: Fix this test
    // it("renders popup if popup state is set (real)", async () => {
    // it("renders popup if popup state is set (simulated)", async () => {
    //     // Simulate click event triggering popup
    //     const clickHandler = mockMap.on.mock.calls.find(
    //         ([event]) => event === "click"
    //     )?.[2]
    //
    //     const mockFeature = { properties: { id: 1 } }
    //     const mockEvent = {
    //         features: [mockFeature],
    //         lngLat: { lat: 10, lng: 20 },
    //     }
    //
    //     render(<RoomClicker />)
    //
    //     if (clickHandler) await clickHandler(mockEvent)
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Room: Test Room")).toBeDefined()
    //     })
    // })
})
