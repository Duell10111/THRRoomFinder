package com.kospaeth.roomfinder.data.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.util.*

/**
 * Entity representing a building.
 *
 * Stores the building's unique identifier and name for database persistence.
 *
 * @property id The unique identifier of the building (nullable for new entries).
 * @property name The name of the building.
 */
@Table
data class Building(
    @Id
    val id: UUID? = null,
    val name: String,
)
