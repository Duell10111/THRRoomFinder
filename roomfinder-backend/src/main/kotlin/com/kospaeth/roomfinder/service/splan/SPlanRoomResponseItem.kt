package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Data class representing a room entry returned by the StarPlan system.
 *
 * This class is used to deserialize JSON responses from StarPlan APIs.
 *
 * @property id The unique identifier of the room.
 * @property shortName A short name or abbreviation of the room, mapped from the "shortname" JSON property.
 * @property name The full name or description of the room.
 */
data class SPlanRoomResponseItem(
    val id: Long,
    @JsonProperty("shortname")
    val shortName: String,
    val name: String,
)
