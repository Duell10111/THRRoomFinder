package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.entities.Building
import com.kospaeth.roomfinder.data.repository.BuildingRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service

private val logger = KotlinLogging.logger {}

@Service
class BuildingService(
    private val buildingRepository: BuildingRepository,
) {
    suspend fun getBuildingForRoom(roomName: String): Building? {
        return getBuildingNameForRoom(roomName)?.let { buildingName ->
            buildingRepository.findBuildingByName(buildingName)
                ?: buildingRepository.save(Building(name = buildingName)).also {
                    logger.info { "Creating new building $buildingName for room name: $roomName" }
                }
        }
    }

    private fun getBuildingNameForRoom(roomName: String): String? {
        return roomName.split(".").firstOrNull()
    }
}
