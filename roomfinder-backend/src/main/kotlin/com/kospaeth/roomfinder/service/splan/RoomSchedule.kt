package com.kospaeth.roomfinder.service.splan

import java.time.LocalDateTime

data class RoomSchedule(
    val location: StarPlanLocation,
    val room: String,
    val name: String,
    val lecturer: String,
    val relevantDegrees: String? = null,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
)
