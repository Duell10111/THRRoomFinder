package com.kospaeth.roomfinder.data.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.util.*

@Table
data class Building(
    @Id
    val id: UUID? = null,
    val name: String,
)
