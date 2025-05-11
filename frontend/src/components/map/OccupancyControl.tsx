import { useControl, useMap } from "react-map-gl/maplibre"
import { GeoJSONSource, IControl, Map } from "maplibre-gl"
import { booleanPointInPolygon } from "@turf/turf"
import { useRoomContext } from "@/context/RoomContext"
import { useEffect, useState } from "react"
import { ScheduleData } from "@/utils/data"

export default function OccupancyControl() {
    const { data } = useRoomContext()
    const { current } = useMap()
    const [showOccupancy, setShowOccupancy] = useState(false)

    useEffect(() => {
        const map = current?.getMap?.()
        if (data?.scheduleData && map) {
            console.log("Belegung anzeigen: ", Object.keys(data.scheduleData))
            const scheduleData = data.scheduleData
            const source = map.getSource("occupancy-room") as GeoJSONSource
            source.getData().then((sourceData) => {
                if (sourceData.type === "FeatureCollection") {
                    console.log("Source data features: ", sourceData.features)
                    // Add new rooms to source data
                    Object.entries(scheduleData).forEach(
                        ([roomName, schedule]) => {
                            // Check if room is already in source data
                            if (
                                !sourceData.features?.find(
                                    (feature) =>
                                        feature.properties?.roomName ===
                                        roomName
                                )
                            ) {
                                const { nameFeature, polygonFeature } =
                                    getRoomFeature(map, roomName)
                                if (nameFeature && polygonFeature) {
                                    polygonFeature.properties["roomName"] =
                                        roomName
                                    source.setData({
                                        type: "FeatureCollection",
                                        features: [
                                            ...sourceData.features,
                                            polygonFeature,
                                        ],
                                    })
                                } else {
                                    console.warn(
                                        `Could not find room feature for room ${roomName}`
                                    )
                                }
                            }
                            const occupied = checkIfRoomIsOccupied(schedule)
                            map.setFeatureState(
                                {
                                    source: "occupancy-room",
                                    id: roomName,
                                },
                                { occupied: occupied }
                            )
                            // const state = map.getFeatureState({
                            //     source: "occupancy-room",
                            //     id: roomName,
                            // })
                            // console.log("Feature state: ", state)
                        }
                    )
                    // Debugging
                    const features = map.queryRenderedFeatures({
                        layers: ["occupancy-room-layer"],
                    })
                    console.log("OCC Features: ", features)
                } else {
                    console.warn("Source data is not a FeatureCollection")
                }
            })
        }
    }, [data?.scheduleData, current, showOccupancy])

    console.log("Occc: ", showOccupancy)

    useControl(() => {
        return new OccupancyController(() => {
            setShowOccupancy((prev) => !prev)
        })
    })

    // Empty component
    return null
}

function getRoomFeature(map: Map, roomName: string) {
    const nameFeatures = map.queryRenderedFeatures({ layers: ["indoor-name"] })
    const nameFeature = nameFeatures.find(
        (feature) => feature.properties.name === roomName
    )
    // map.querySourceFeatures("indoor", {
    //     sourceLayer: "indoor-polygon",
    // })
    const polygonFeatures = map.queryRenderedFeatures({
        layers: ["indoor-polygon"],
    })
    const polygonFeature = polygonFeatures.find((feature) => {
        if (
            nameFeature?.geometry.type === "Point" &&
            feature.geometry.type === "Polygon"
        ) {
            return booleanPointInPolygon(nameFeature.geometry, feature.geometry)
        }
        return false
    })
    return { nameFeature, polygonFeature }
}

function checkIfRoomIsOccupied(schedule: ScheduleData[]) {
    const now = Date.now()
    return (
        schedule.find(
            (entry) =>
                Date.parse(entry.startTime) >= now &&
                Date.parse(entry.endTime) <= now
        ) !== undefined
    )
}

class OccupancyController implements IControl {
    private _map?: Map
    private _container?: HTMLDivElement
    private _button?: HTMLButtonElement
    private _active = false

    private readonly toggleCallback?: () => void

    constructor(toggleCallback: typeof this.toggleCallback) {
        this.toggleCallback = toggleCallback
    }

    onAdd(map: Map): HTMLElement {
        this._map = map
        this._container = document.createElement("div")
        this._container.className = "maplibregl-ctrl maplibregl-ctrl-group"

        this._button = document.createElement("button")
        this._button.type = "button"
        this._button.innerHTML = "🗺️" // Icon/Text deiner Wahl
        this._button.title = "Belegung anzeigen"
        this._button.onclick = () => {
            this.toggleLayer()
        }

        this._container.appendChild(this._button)
        return this._container
    }

    onRemove(): void {
        this._container?.parentNode?.removeChild(this._container)
        this._map = undefined
    }

    private toggleLayer() {
        if (!this._map || !this._button) return

        this._active = !this._active

        this._map.setLayoutProperty(
            "occupancy-room-layer",
            "visibility",
            this._active ? "visible" : "none"
        )

        // Visuelle Umschaltung per Klasse
        if (this._active) {
            this._button.classList.add("maplibregl-ctrl-active")
        } else {
            this._button.classList.remove("maplibregl-ctrl-active")
        }
        this.toggleCallback?.()
    }
}
