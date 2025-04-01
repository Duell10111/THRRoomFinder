package com.kospaeth.roomfinder.data.entities

import org.springframework.data.annotation.Id
import org.springframework.data.geo.Point
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
import java.util.UUID

@Table
data class Room(
    @Id
    val id: UUID? = null,
    val name: String,
    val location: Point,
    val source: Source,
    val buildingId: UUID? = null,
    val updatedAt: LocalDateTime? = null,
)
