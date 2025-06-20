import { booleanPointInPolygon } from "@turf/turf"
import { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl"
import { MapRef } from "react-map-gl/maplibre"

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
