package com.kospaeth.roomfinder.data.entities

import org.springframework.data.geo.Point
import java.util.*

/**
 * Data class representing a room along with its associated building metadata.
 *
 * Typically used in projections or joins that include both room and building information.
 *
 * @property id The unique identifier of the room.
 * @property name The internal name of the room.
 * @property displayName An optional user-facing name for display purposes.
 * @property location The geographic coordinates of the room.
 * @property buildingId The UUID of the associated building, or null if not assigned.
 * @property buildingName The name of the associated building, or null if not available.
 */
data class RoomWithBuildingData(
    val id: UUID,
    val name: String,
    val displayName: String? = null,
    val location: Point,
    val buildingId: UUID? = null,
    val buildingName: String? = null,
)
