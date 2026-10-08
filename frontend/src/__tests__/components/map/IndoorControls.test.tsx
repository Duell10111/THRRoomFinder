import { expect, vi, Mock } from "vitest"
import { render } from "@testing-library/react"
import { IndoorControls } from "@/components/map/IndoorControls"

import React from "react"
import { useControl } from "react-map-gl/maplibre"

const { IndoorEqual, mockLoadSprite, mockSetLevel } = vi.hoisted(() => {
    const mockLoadSprite = vi.fn()
    const mockSetLevel = vi.fn()
    const mockOn = vi.fn()
    const mockOff = vi.fn()

    const IndoorEqual = vi.fn()
    IndoorEqual.prototype.loadSprite = mockLoadSprite
    IndoorEqual.prototype.setLevel = mockSetLevel
    IndoorEqual.prototype.on = mockOn
    IndoorEqual.prototype.off = mockOff

    return { IndoorEqual, mockLoadSprite, mockSetLevel }
})

// Mock useControl hook
vi.mock("react-map-gl/maplibre", () => ({
    useControl: vi.fn(),
}))

// Override module for IndoorEqual
vi.mock("maplibre-gl-indoorequal", () => {
    return {
        default: IndoorEqual,
    }
})

vi.mock("@/context/RoomContext", () => ({
    useRoomContext: vi.fn(() => ({ level: "1" })),
}))

describe("IndoorControls", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createFakeMapInstance = (styleLoaded: boolean) => ({
        on: vi.fn(),
        isStyleLoaded: vi.fn(() => styleLoaded),
        getSource: vi.fn(),
        addSource: vi.fn(),
    })

    const mockUseControl = (fakeMapInstance: unknown) => {
        ;(useControl as Mock).mockImplementation(
            (callback: (props: { map: { getMap: () => unknown } }) => void) => {
                return callback({ map: { getMap: () => fakeMapInstance } })
            }
        )
    }

    it("should initialize IndoorEqual with correct parameters", () => {
        const fakeMapInstance = createFakeMapInstance(false)
        mockUseControl(fakeMapInstance)

        render(<IndoorControls />)

        expect(IndoorEqual).toHaveBeenCalledWith(
            fakeMapInstance,
            expect.objectContaining({
                apiKey: `${process.env.NEXT_PUBLIC_INDOOR_CONTROL_API_KEY}`,
                heatmap: false,
                layers: expect.any(Array),
            })
        )
        const callArgs = (IndoorEqual as Mock).mock.calls[0][1]
        expect(Array.isArray(callArgs.layers)).toBe(true)
        expect(callArgs.layers).toHaveLength(12)

        expect(mockLoadSprite).toHaveBeenCalledWith("/indoorequal/indoorequal")
        expect(mockSetLevel).toHaveBeenCalledWith("1")
    })

    it("should add custom layer sources before IndoorEqual adds its layers", () => {
        const fakeMapInstance = createFakeMapInstance(false)
        mockUseControl(fakeMapInstance)

        render(<IndoorControls />)

        // Sources are not added before the style is loaded
        expect(fakeMapInstance.addSource).not.toHaveBeenCalled()
        expect(fakeMapInstance.on).toHaveBeenCalledWith(
            "style.load",
            expect.any(Function)
        )
        expect(fakeMapInstance.on.mock.invocationCallOrder[0]).toBeLessThan(
            (IndoorEqual as Mock).mock.invocationCallOrder[0]
        )

        // Trigger style load
        fakeMapInstance.on.mock.calls[0][1]()
        expect(fakeMapInstance.addSource).toHaveBeenCalledWith(
            "highlight-room",
            expect.objectContaining({ type: "geojson" })
        )
        expect(fakeMapInstance.addSource).toHaveBeenCalledWith(
            "occupancy-room",
            expect.objectContaining({ promoteId: "roomName" })
        )
    })

    it("should add custom layer sources directly if style is already loaded", () => {
        const fakeMapInstance = createFakeMapInstance(true)
        mockUseControl(fakeMapInstance)

        render(<IndoorControls />)

        expect(fakeMapInstance.addSource).toHaveBeenCalledTimes(2)
    })

    it("should render nothing", () => {
        const { container } = render(<IndoorControls />)
        expect(container.firstChild).toBeNull()
    })
})
