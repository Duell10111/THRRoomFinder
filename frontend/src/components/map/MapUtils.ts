import { booleanPointInPolygon } from "@turf/turf"
import { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl"
import { MapRef } from "react-map-gl/maplibre"

/**
 * Attempts to find the name of a room based on a polygon feature clicked on the map.
 *
 * The function checks if the clicked feature is a polygon, then queries for point features
 * on the 'indoor-name' layer. If a point lies within the polygon, its name property is returned.
 *
 * @param e - The mouse event from the map click, containing potential feature data.
 * @param map - The MapLibre map reference used to query rendered features.
 * @returns The name of the room if found, otherwise undefined.
 */
export function getRoomName(
    e: MapMouseEvent & { features?: MapGeoJSONFeature[] },
    map: MapRef
): string | undefined {
    const geometry = e.features?.[0]?.geometry
    if (geometry && geometry.type === "Polygon") {
        const nameFeatures = map.queryRenderedFeatures({
            layers: ["indoor-name"],
        })
        const roomName = nameFeatures.find((f) => {
            if (f.geometry.type === "Point") {
                return booleanPointInPolygon(f.geometry, geometry)
            }
            // Ignore non compatible geometry
            return false
        })
        if (roomName) {
            return roomName?.properties.name
        }
    }
}
