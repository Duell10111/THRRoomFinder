package com.kospaeth.roomfinder.data.entities

import org.springframework.data.geo.Point

data class Room(
    val name: String,
    val location: Point,
)
