package com.kospaeth.roomfinder.data.entities

import org.springframework.data.annotation.Id
import org.springframework.data.geo.Point
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
import java.util.UUID

/**
 * Entity representing a room, including its spatial, descriptive, and relational metadata.
 *
 * Used for storing and retrieving room information from the database.
 *
 * @property id The unique identifier of the room (nullable for new entries).
 * @property name The internal name of the room.
 * @property displayName Optional user-facing display name of the room.
 * @property location The geographic location of the room as a [Point].
 * @property source The source of the room data (e.g., OSM).
 * @property buildingId Optional ID of the building the room belongs to.
 * @property updatedAt Timestamp of the last update to this room entry.
 */
@Table
data class Room(
    @Id
    val id: UUID? = null,
    val name: String,
    val displayName: String? = null,
    val location: Point,
    val source: Source,
    val buildingId: UUID? = null,
    val updatedAt: LocalDateTime? = null,
)
