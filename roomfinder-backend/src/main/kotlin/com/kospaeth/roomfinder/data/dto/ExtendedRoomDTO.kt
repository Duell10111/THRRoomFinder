package com.kospaeth.roomfinder.data.dto

/**
 * Data Transfer Object (DTO) representing a room along with additional building information.
 *
 * @property name The name of the room.
 * @property location The geographic location of the room.
 * @property buildingName The name of the building the room belongs to, or null if not assigned.
 */
data class ExtendedRoomDTO(
    val name: String,
    val location: LocationDTO,
    val buildingName: String?,
)
