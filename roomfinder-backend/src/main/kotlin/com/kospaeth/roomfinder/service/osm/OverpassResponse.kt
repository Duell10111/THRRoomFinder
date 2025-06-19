package com.kospaeth.roomfinder.service.osm

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.springframework.data.geo.Point

/**
 * Represents the response from an Overpass API query.
 *
 * @property elements A list of elements returned in the Overpass response.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class OverpassResponse(
    val elements: List<Element>,
)

/**
 * Represents a single element in an Overpass API response.
 *
 * @property id The unique identifier of the element.
 * @property lat The latitude of the element, if available.
 * @property lon The longitude of the element, if available.
 * @property type The type of the element (e.g., "node", "way").
 * @property tags A map of tag key-value pairs associated with the element.
 * @property nodes A list of node IDs that define the element's geometry, if applicable.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class Element(
    val id: Long,
    val lat: Double? = null,
    val lon: Double? = null,
    val type: String,
    val tags: Map<String, String>? = null,
    val nodes: List<Long>? = null,
)

/**
 * Extension property that finds the first element tagged as an indoor room.
 *
 * @receiver The [OverpassResponse] to search through.
 * @return The first [Element] with tag "indoor" = "room", or null if none found.
 */
val OverpassResponse.roomElement: Element?
    get() = elements.firstOrNull { it.tags?.get("indoor") == "room" }

/**
 * Calculates the approximate center location of a room element based on its node geometry.
 *
 * Uses the bounding box approach to compute a center from all valid node coordinates.
 *
 * @receiver The [OverpassResponse] containing the room element and its nodes.
 * @return A [Point] representing the central location of the room, or null if coordinates are unavailable.
 */
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

/**
 * Extension property to retrieve the name tag of an element, if present.
 *
 * @receiver The [Element] to extract the name from.
 * @return The value of the "name" tag, or null if not present.
 */
val Element.name: String?
    get() = tags?.get("name")
