import { render, screen } from "../../test-utils"
import { describe, it, vi, beforeEach, expect } from "vitest"
import { RoomClicker } from "@/components/map/RoomClicker"
import React from "react"
import { waitForElementToBeRemoved } from "@testing-library/dom"
import * as Notifications from "@/utils/notifications"

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

vi.mock("@/components/map/MapUtils", () => {
    return {
        getRoomName: () => "Test Room",
    }
})

// Mock RoomContext
const setRoom = vi.fn().mockResolvedValue(undefined)
const mockRoomData = { roomData: { name: "Test Room" } }
let mockLevel: string | undefined

vi.mock("@/context/RoomContext", () => ({
    useRoomContext: () => ({
        setRoom,
        data: mockRoomData,
        level: mockLevel,
    }),
}))

describe("RoomClicker", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLevel = undefined
    })

    it("attaches click listener to map on indoor-polygon layer", () => {
        render(<RoomClicker />)
        expect(mockMap.on).toHaveBeenCalledWith(
            "click",
            "indoor-polygon",
            expect.any(Function)
        )
    })

    it("renders popup if popup state is set (simulated)", async () => {
        const mockFeature = { properties: { id: 1 } }
        const mockEvent = {
            features: [mockFeature],
            lngLat: { lat: 10, lng: 20 },
        }
        mockMap.on.mockImplementation((event, layer, callback) => {
            callback(mockEvent)
        })

        render(<RoomClicker />)

        expect(screen.getByTestId("loader-room-popup")).toBeDefined()
    })

    it("renders popup if popup state is set (simulated) and closes on exception", async () => {
        const mockFeature = { properties: { id: 1 } }
        const mockEvent = {
            features: [mockFeature],
            lngLat: { lat: 10, lng: 20 },
        }
        mockMap.on.mockImplementation((event, layer, callback) => {
            callback(mockEvent)
        })

        setRoom.mockRejectedValueOnce("Error")

        const errorNotificationSpy = vi.spyOn(
            Notifications,
            "showErrorNotification"
        )

        render(<RoomClicker />)

        expect(screen.getByTestId("loader-room-popup")).toBeDefined()

        await waitForElementToBeRemoved(() =>
            screen.getByTestId("loader-room-popup")
        )

        expect(errorNotificationSpy).toHaveBeenCalled()
    })

    it("closes popup when level changes", () => {
        const mockEvent = {
            features: [{ properties: { id: 1 } }],
            lngLat: { lat: 10, lng: 20 },
        }
        mockMap.on.mockImplementation((event, layer, callback) => {
            callback(mockEvent)
        })

        mockLevel = "0"
        const { rerender } = render(<RoomClicker />)
        expect(screen.getByTestId("loader-room-popup")).toBeDefined()

        // Prevent the click handler from reopening the popup on rerender
        mockMap.on.mockReset()
        mockLevel = "1"
        // Same fragment structure as test-utils render, so RoomClicker keeps its state
        rerender(
            <>
                <RoomClicker />
            </>
        )

        expect(screen.queryByTestId("loader-room-popup")).toBeNull()
    })
})
