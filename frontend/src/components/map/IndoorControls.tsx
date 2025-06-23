// @ts-expect-error maplibre-gl-indoorequal does not have a type definition library
import IndoorEqual from "maplibre-gl-indoorequal"
import { useControl } from "react-map-gl/maplibre"
import { useRoomContext } from "@/context/RoomContext"
import { useEffect } from "react"

/**
 * React component that integrates the IndoorEqual library into the map for indoor level control.
 *
 * - Loads indoor level graphics and sets the initial level from context.
 * - Syncs indoor level changes between the map and the application context.
 * - Listens for level change events emitted by IndoorEqual and updates context state.
 *
 * This component does not render any visible UI elements.
 *
 * @returns null
 */
export function IndoorControls() {
    const { level, setLevel } = useRoomContext()

    const indoorEqual = useControl(({ map }) => {
        const indoorEqual = new IndoorEqual(map.getMap(), {
            apiKey: `${process.env.NEXT_PUBLIC_INDOOR_CONTROL_API_KEY}`,
            heatmap: false,
            layers: layers,
        })
        // Load graphics from indoorequal
        indoorEqual.loadSprite("/indoorequal/indoorequal")
        if (level) {
            indoorEqual.setLevel(level)
        }

        return indoorEqual
    })

    useEffect(() => {
        if (level) {
            indoorEqual.setLevel(level)
        }
    }, [level, indoorEqual])

    useEffect(() => {
        const eventFkt = (level: string) => {
            setLevel?.(level)
        }

        indoorEqual.on("levelchange", eventFkt)

        return () => indoorEqual.off("levelchange", eventFkt)
    }, [indoorEqual, setLevel])

    // Empty component
    return null
}

/**
 * IndoorEqual-compatible layer configuration used to render indoor areas and POIs on the map.
 *
 * This configuration includes default styling for indoor polygons, lines, POIs, and custom overlays
 * like room occupancy and room highlighting. These layers define how features are visually styled
 * and how interactivity such as feature-state logic is applied.
 */
// Original fetched from indoorequal library
// https://github.com/indoorequal/maplibre-gl-indoorequal/blob/master/src/layers.js
const commonPoi = {
    type: "symbol",
    "source-layer": "poi",
    layout: {
        "icon-image": [
            "coalesce",
            [
                "image",
                ["concat", ["literal", "indoorequal-"], ["get", "subclass"]],
            ],
            [
                "image",
                ["concat", ["literal", "indoorequal-"], ["get", "class"]],
            ],
        ],
        "text-anchor": "top",
        "text-field": [
            "case",
            // aeroway=gate
            ["==", ["get", "class"], "aeroway"],
            ["get", "ref"],
            // default
            ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
        ],
        "text-max-width": 9,
        "text-offset": [0, 0.6],
        "text-padding": 2,
        "text-size": 12,
    },
    paint: {
        "text-color": "#666",
        "text-halo-blur": 0.5,
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
    },
}

const rank2Class = [
    "waste_basket",
    "information",
    "vending_machine",
    "bench",
    "photo_booth",
    "ticket_validator",
]

export const layers = [
    {
        id: "indoor-polygon",
        type: "fill",
        "source-layer": "area",
        filter: ["all", ["==", "$type", "Polygon"], ["!=", "class", "level"]],
        paint: {
            "fill-color": [
                "case",
                // if private
                [
                    "all",
                    ["has", "access"],
                    ["in", ["get", "access"], ["literal", ["no", "private"]]],
                ],
                "#F2F1F0",
                // if POI
                [
                    "any",
                    [
                        "all",
                        ["==", ["get", "is_poi"], true],
                        ["!=", ["get", "class"], "corridor"],
                    ],
                    [
                        "in",
                        ["get", "subclass"],
                        [
                            "literal",
                            [
                                "class",
                                "laboratory",
                                "office",
                                "auditorium",
                                "amphitheatre",
                                "reception",
                            ],
                        ],
                    ],
                ],
                "#D4EDFF",
                // if is a room
                ["==", ["get", "class"], "room"],
                "#fefee2",
                // default
                "#fdfcfa",
            ],
        },
    },
    {
        id: "indoor-area",
        type: "line",
        "source-layer": "area",
        filter: ["all", ["in", "class", "area", "corridor", "platform"]],
        paint: {
            "line-color": "#bfbfbf",
            "line-width": 1,
        },
    },
    {
        id: "indoor-column",
        type: "fill",
        "source-layer": "area",
        filter: ["all", ["==", "class", "column"]],
        paint: {
            "fill-color": "#bfbfbf",
        },
    },
    {
        id: "indoor-lines",
        type: "line",
        "source-layer": "area",
        filter: ["all", ["in", "class", "room", "wall"]],
        paint: {
            "line-color": "gray",
            "line-width": 2,
        },
    },
    {
        id: "indoor-transportation",
        type: "line",
        "source-layer": "transportation",
        filter: ["all"],
        paint: {
            "line-color": "gray",
            "line-dasharray": [0.4, 0.75],
            "line-width": {
                base: 1.4,
                stops: [
                    [17, 2],
                    [20, 10],
                ],
            },
        },
    },
    // Start Custom Layers - Placed here to be below the map symbols
    // Occupancy Room Layer
    {
        id: "occupancy-room-layer",
        type: "fill",
        source: "occupancy-room",
        paint: {
            "fill-color": [
                "case",
                // if the room is occupied
                ["boolean", ["feature-state", "occupied"], false],
                "#841111",
                // default
                "#51b61d",
            ],
            "fill-opacity": 0.4,
        },
        layout: {
            visibility: "none",
        },
    },
    {
        id: "highlight-room-layer",
        type: "fill",
        source: "highlight-room",
        paint: {
            "fill-color": "#0015ff",
            "fill-opacity": 0.4,
        },
    },
    // End Custom Layers
    {
        id: "indoor-transportation-poi",
        type: "symbol",
        "source-layer": "transportation",
        filter: [
            "all",
            ["in", "$type", "Point", "LineString"],
            ["in", "class", "steps", "elevator", "escalator"],
        ],
        layout: {
            "icon-image": [
                "case",
                ["has", "conveying"],
                "indoorequal-escalator",
                ["concat", ["literal", "indoorequal-"], ["get", "class"]],
            ],
            "symbol-placement": "line-center",
            "icon-rotation-alignment": "viewport",
        },
    },
    {
        id: "indoor-poi-rank1",
        ...commonPoi,
        filter: [
            "all",
            ["==", "$type", "Point"],
            ["!in", "class", ...rank2Class],
        ],
    },
    {
        id: "indoor-poi-rank2",
        ...commonPoi,
        minzoom: 19,
        filter: [
            "all",
            ["==", "$type", "Point"],
            ["in", "class", ...rank2Class],
        ],
    },
    {
        id: "indoor-heat",
        type: "heatmap",
        "source-layer": "heat",
        filter: ["all"],
        paint: {
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(102, 103, 173, 0)",
                0.1,
                "rgba(102, 103, 173, 0.2)",
                1,
                "rgba(102, 103, 173, 0.7)",
            ],
            "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                3,
                13,
                20,
                17,
                40,
            ],
            "heatmap-intensity": 1,
            "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                16,
                1,
                17.1,
                0,
            ],
        },
    },
    {
        id: "indoor-name",
        type: "symbol",
        "source-layer": "area_name",
        filter: ["all"],
        layout: {
            "text-field": [
                "concat",
                ["coalesce", ["get", "name:latin"], ["get", "ref"]],
                "\n",
                ["get", "name:nonlatin"],
            ],
            "text-max-width": 5,
            "text-size": 14,
        },
        paint: {
            "text-color": "#666",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1,
        },
    },
]
