import { expect, vi, Mock } from "vitest"
import { render } from "@testing-library/react"
import { IndoorControls } from "@/components/map/IndoorControls"

import React from "react"
import { useControl } from "react-map-gl/maplibre"

const { IndoorEqual, mockLoadSprite } = vi.hoisted(() => {
    const mockLoadSprite = vi.fn()

    const IndoorEqual = vi.fn()
    IndoorEqual.prototype.loadSprite = mockLoadSprite

    return { IndoorEqual, mockLoadSprite }
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

describe("IndoorControls", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should initialize IndoorEqual with correct parameters", () => {
        const fakeMap = {
            getMap: () => "fakeMapInstance",
        } // Call useControl mock with implementation

        ;(useControl as Mock).mockImplementation(
            (callback: (props: { map: { getMap: () => unknown } }) => void) => {
                callback({ map: fakeMap })
            }
        )

        render(<IndoorControls />)

        expect(IndoorEqual).toHaveBeenCalledWith(
            "fakeMapInstance",
            expect.objectContaining({
                apiKey: `${process.env.NEXT_PUBLIC_INDOOR_CONTROL_API_KEY}`,
                heatmap: false,
                layers: expect.any(Array),
            })
        )
        const callArgs = (IndoorEqual as Mock).mock.calls[0][1]
        expect(Array.isArray(callArgs.layers)).toBe(true)
        expect(callArgs.layers).toHaveLength(11)

        expect(mockLoadSprite).toHaveBeenCalledWith("/indoorequal/indoorequal")
    })

    it("should render nothing", () => {
        const { container } = render(<IndoorControls />)
        expect(container.firstChild).toBeNull()
    })
})
