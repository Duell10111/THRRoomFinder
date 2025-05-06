import { describe, it, expect, vi } from "vitest"
import { MapRef } from "react-map-gl/maplibre"
import { getRoomName } from "@/components/map/MapUtils"

const createMockMap = (features: unknown[]) => {
    return {
        queryRenderedFeatures: vi.fn().mockReturnValue(features),
    } as unknown as MapRef
}

describe("getRoomName", () => {
    it("should return the room name if a point is inside the polygon", () => {
        const mockPolygon = {
            type: "Polygon",
            coordinates: [
                [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 10],
                    [0, 0],
                ],
            ],
        }

        const mockPoint = {
            type: "Point",
            coordinates: [5, 5],
        }

        const mockEvent = {
            features: [
                {
                    geometry: mockPolygon,
                },
            ],
        } as never

        const mockMap = createMockMap([
            {
                geometry: {
                    // Some unsupported geometry type
                    type: "Polygon",
                    coordinates: [5, 5],
                },
            },
            {
                geometry: mockPoint,
                properties: { name: "Room A" },
            },
        ])

        const name = getRoomName(mockEvent, mockMap)
        expect(name).toBe("Room A")
    })

    it("should return undefined if no polygon geometry is present", () => {
        const mockEvent = { features: [{}] } as never
        const mockMap = createMockMap([])
        const name = getRoomName(mockEvent, mockMap)
        expect(name).toBeUndefined()
    })

    it("should return undefined if no point is inside the polygon", () => {
        const mockPolygon = {
            type: "Polygon",
            coordinates: [
                [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                ],
            ],
        }

        const mockPoint = {
            type: "Point",
            coordinates: [5, 5],
        }

        const mockEvent = {
            features: [
                {
                    geometry: mockPolygon,
                },
            ],
        } as never

        const mockMap = createMockMap([
            {
                geometry: mockPoint,
                properties: { name: "Room B" },
            },
        ])

        const name = getRoomName(mockEvent, mockMap)
        expect(name).toBeUndefined()
    })
})
