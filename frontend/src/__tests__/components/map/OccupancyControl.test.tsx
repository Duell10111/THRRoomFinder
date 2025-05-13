import { expect, vi } from "vitest"
import { render } from "@testing-library/react"

import React from "react"
import OccupancyControl, {
    OccupancyController,
} from "@/components/map/OccupancyControl"

const { currentMap, map, mapSource } = vi.hoisted(() => {
    const mapSource = {
        getData: vi.fn(async () => ({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [13.404954, 52.520008],
                    },
                    properties: {
                        room: "A0.03",
                    },
                },
            ],
        })),
        setData: vi.fn(({}) => {}),
    }

    const queryRenderedFeatures = vi.fn()
    const setFeatureState = vi.fn()

    const map = {
        getSource: vi.fn(() => mapSource),
        queryRenderedFeatures,
        setFeatureState,
    }

    const currentMap = {
        getMap: vi.fn(() => map),
    }

    return {
        currentMap,
        map,
        mapSource,
        queryRenderedFeatures,
        setFeatureState,
    }
})

// Mock useControl hook
vi.mock("react-map-gl/maplibre", () => ({
    useControl: vi.fn((callback: () => void) => {
        return callback()
    }),
    useMap: vi.fn(() => ({
        current: currentMap,
    })),
}))

vi.mock("@/context/RoomContext", () => ({
    useRoomContext: vi.fn(() => ({
        data: {
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
    })),
}))

vi.mock("@turf/turf", () => ({
    booleanPointInPolygon: vi.fn(() => true),
}))

describe("OccupancyControl", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should initialize Occupancy with correct parameters", async () => {
        map.queryRenderedFeatures.mockImplementation(({ layers }) => {
            if (layers.includes("indoor-name")) {
                return [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [
                                12.106975838541985, 47.86771506934673,
                            ],
                        },
                        properties: {
                            name: "A0.03",
                        },
                    },
                ]
            } else if (layers.includes("indoor-polygon")) {
                return [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [
                                [12.106942981481552, 47.867798289006174],
                                [12.10703082382679, 47.8677924411426],
                                [12.10702545940876, 47.86775285558704],
                                [12.107015401124954, 47.867671885038334],
                                [12.106926217675209, 47.86767683324217],
                                [12.106942981481552, 47.867798289006174],
                            ],
                        },
                        properties: {
                            class: "room",
                        },
                    },
                ]
            }
            return []
        })

        render(<OccupancyControl />)

        expect(map.getSource).toHaveBeenCalledWith("occupancy-room")
        // Wait for setFeatureState to be called
        await vi.waitFor(() => expect(map.setFeatureState).toHaveBeenCalled())
        expect(mapSource.setData).toHaveBeenCalled()
        const callArgs = mapSource.setData.mock.calls[0][0]
        expect(callArgs.type).toBe("FeatureCollection")
        expect(callArgs.features[0]).toEqual({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [13.404954, 52.520008],
            },
            properties: {
                room: "A0.03",
            },
        })
        expect(callArgs.features[1]).toEqual({
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    [12.106942981481552, 47.867798289006174],
                    [12.10703082382679, 47.8677924411426],
                    [12.10702545940876, 47.86775285558704],
                    [12.107015401124954, 47.867671885038334],
                    [12.106926217675209, 47.86767683324217],
                    [12.106942981481552, 47.867798289006174],
                ],
            },
            properties: {
                class: "room",
                roomName: "A0.03",
            },
        })
        expect(map.setFeatureState).toHaveBeenCalledWith(
            {
                source: "occupancy-room",
                id: "A0.03",
            },
            { occupied: false }
        )
    })

    it("should render nothing", () => {
        const { container } = render(<OccupancyControl />)
        expect(container.firstChild).toBeNull()
    })
})

describe("OccupancyController", () => {
    it("onAdd", () => {
        const controller = new OccupancyController(() => {})
        const element = controller.onAdd({} as never)
        expect(element.className).toBe("maplibregl-ctrl maplibregl-ctrl-group")

        const btn = element.children[0] as HTMLButtonElement
        expect(btn).toBeDefined()
        expect(btn.type).toBe("button")
        expect(btn.title).toBe("Belegung anzeigen")
        expect(btn.onclick).toBeDefined()

        // TODO: Add test for toggleLayer
        // btn.onclick?.({} as never)
    })

    it("onRemove", () => {
        const controller = new OccupancyController(() => {})
        const parent = document.createElement("div")
        const spy = vi.spyOn(parent, "removeChild")

        const child = controller.onAdd({} as never)
        parent.appendChild(child)

        controller.onRemove()
        expect(spy).toHaveBeenCalled()
    })
})
