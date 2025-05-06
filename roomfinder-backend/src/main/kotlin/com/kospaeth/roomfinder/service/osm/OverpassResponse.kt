package com.kospaeth.roomfinder.service.osm

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.springframework.data.geo.Point

@JsonIgnoreProperties(ignoreUnknown = true)
data class OverpassResponse(
    val elements: List<Element>,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Element(
    val id: Long,
    val lat: Double? = null,
    val lon: Double? = null,
    val type: String,
    val tags: Map<String, String>? = null,
    val nodes: List<Long>? = null,
)

val OverpassResponse.roomElement: Element?
    get() = elements.firstOrNull { it.tags?.get("indoor") == "room" }

val OverpassResponse.locationPoint: Point?
    get() {
        return roomElement?.nodes?.mapNotNull { nodeId -> elements.find { it.id == nodeId } }
            ?.takeIf { it.isNotEmpty() }?.filter { it.lat != null && it.lon != null }?.let { nodes ->
                val lats = nodes.mapNotNull { it.lat }
                val lons = nodes.mapNotNull { it.lon }
                val centerLat = (lats.min() + lats.max()) / 2
                val centerLon = (lons.min() + lons.max()) / 2
                Point(centerLat, centerLon)
            }
    }

val Element.name: String?
    get() = tags?.get("name")
