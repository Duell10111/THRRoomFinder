package com.kospaeth.roomfinder.data.dto

/**
 * Data Transfer Object (DTO) representing a basic room with its location.
 *
 * @property name The name of the room.
 * @property location The geographic location of the room.
 */
data class RoomDTO(
    val name: String,
    val location: LocationDTO,
)
