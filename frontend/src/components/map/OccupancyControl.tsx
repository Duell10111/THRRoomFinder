import { useControl, useMap } from "react-map-gl/maplibre"
import { GeoJSONSource, IControl, Map } from "maplibre-gl"
import { booleanPointInPolygon } from "@turf/turf"
import { useRoomContext } from "@/context/RoomContext"
import { useEffect, useState } from "react"
import { ScheduleData } from "@/utils/data"
import _ from "lodash"

export default function OccupancyControl() {
    const { data } = useRoomContext()
    const { current } = useMap()
    const [showOccupancy, setShowOccupancy] = useState(false)
    // const [updateData, setUpdateData] = useState(false)
    //
    // useEffect(() => {
    //     const map = current?.getMap?.()
    //     if (map) {
    //         map.on("moveend", () => {
    //             setUpdateData((prev) => !prev)
    //         })
    //     }
    // }, [current])

    useEffect(() => {
        const map = current?.getMap?.()
        if (data?.scheduleData && map) {
            console.log("Belegung anzeigen: ", Object.keys(data.scheduleData))
            const scheduleData = data.scheduleData
            const source = map.getSource("occupancy-room") as GeoJSONSource
            source
                ?.getData()
                ?.then((sourceData) => {
                    if (sourceData.type === "FeatureCollection") {
                        console.log(
                            "Source data features: ",
                            sourceData.features
                        )
                        // TODO: Try to add all rooms on default?
                        // Add new rooms to source data
                        const newFeatures = _.chain(Object.keys(scheduleData))
                            .map((roomName) => {
                                if (
                                    !sourceData.features?.find(
                                        (feature) =>
                                            feature.properties?.roomName ===
                                            roomName
                                    )
                                ) {
                                    const { polygonFeature } = getRoomFeature(
                                        map,
                                        roomName
                                    )
                                    if (polygonFeature) {
                                        polygonFeature.properties["roomName"] =
                                            roomName
                                        return polygonFeature
                                    } else {
                                        console.warn(
                                            `Could not find room feature for room ${roomName}`
                                        )
                                    }
                                }
                            })
                            .compact()
                            .value()
                        // Update only if newFeatures available
                        if (newFeatures.length > 0) {
                            source.setData({
                                type: "FeatureCollection",
                                features: [
                                    ...sourceData.features,
                                    ...newFeatures,
                                ],
                            })
                        }

                        // Set Feature states for roomNames
                        Object.entries(scheduleData).map(
                            ([roomName, schedule]) => {
                                // TODO: Check if feature state changed?
                                const occupied = checkIfRoomIsOccupied(schedule)
                                map.setFeatureState(
                                    {
                                        source: "occupancy-room",
                                        id: roomName,
                                    },
                                    { occupied: occupied }
                                )
                            }
                        )
                    } else {
                        console.warn("Source data is not a FeatureCollection")
                    }
                })
                ?.catch(console.warn)
        }
        // TODO: Remove showOccupancy from dep list to reduce lag?
    }, [data?.scheduleData, current, showOccupancy])

    useControl(() => {
        return new OccupancyController(() => {
            setShowOccupancy((prev) => !prev)
        })
    })

    // Empty component
    return null
}

function getRoomFeature(map: Map, roomName: string) {
    // TODO: Query all features to not only update rendered features?
    const nameFeatures = map.queryRenderedFeatures({ layers: ["indoor-name"] })
    const nameFeature = nameFeatures.find(
        (feature) => feature.properties.name === roomName
    )
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
                Date.parse(entry.startTime) <= now &&
                Date.parse(entry.endTime) >= now
        ) !== undefined
    )
}

export class OccupancyController implements IControl {
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

        // Switching of active state via class
        if (this._active) {
            this._button.classList.add("maplibregl-ctrl-active")
        } else {
            this._button.classList.remove("maplibregl-ctrl-active")
        }
        this.toggleCallback?.()
    }
}
