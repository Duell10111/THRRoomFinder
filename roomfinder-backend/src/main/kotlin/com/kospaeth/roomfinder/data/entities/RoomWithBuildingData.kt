package com.kospaeth.roomfinder.data.entities

import org.springframework.data.geo.Point
import java.util.*

data class RoomWithBuildingData(
    val id: UUID,
    val name: String,
    val displayName: String? = null,
    val location: Point,
    val buildingId: UUID? = null,
    val buildingName: String? = null,
)
