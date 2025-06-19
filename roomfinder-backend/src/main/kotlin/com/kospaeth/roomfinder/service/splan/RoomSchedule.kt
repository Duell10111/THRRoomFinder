package com.kospaeth.roomfinder.service.splan

import java.time.LocalDateTime

/**
 * Data class representing a scheduled event for a specific room.
 *
 * Contains metadata such as time, lecturer, and degrees relevant to the scheduled session.
 *
 * @property location The StarPlan location where the room is situated.
 * @property room The name or identifier of the room.
 * @property name The title or description of the event.
 * @property lecturer The name of the lecturer or instructor for the event.
 * @property relevantDegrees Optional string listing degrees for which this session is relevant.
 * @property startTime The start date and time of the scheduled session.
 * @property endTime The end date and time of the scheduled session.
 */
data class RoomSchedule(
    val location: StarPlanLocation,
    val room: String,
    val name: String,
    val lecturer: String,
    val relevantDegrees: String? = null,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
)
