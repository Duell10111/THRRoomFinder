package com.kospaeth.roomfinder.data.repository

import com.kospaeth.roomfinder.data.entities.Building
import com.kospaeth.roomfinder.data.entities.Room
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.util.UUID

interface BuildingRepository : CoroutineCrudRepository<Building, UUID> {
    suspend fun findBuildingByName(name: String): Building?
}
