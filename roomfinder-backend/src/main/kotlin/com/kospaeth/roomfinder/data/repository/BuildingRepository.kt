package com.kospaeth.roomfinder.data.repository

import com.kospaeth.roomfinder.data.entities.Building
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.util.UUID

/**
 * Repository interface for managing [Building] entities.
 *
 * Provides coroutine support for CRUD operations and custom queries related to buildings.
 */
interface BuildingRepository : CoroutineCrudRepository<Building, UUID> {
    /**
     * Finds a building by its exact name.
     *
     * @param name The name of the building to search for.
     * @return The [Building] entity if found, otherwise null.
     */
    suspend fun findBuildingByName(name: String): Building?
}
