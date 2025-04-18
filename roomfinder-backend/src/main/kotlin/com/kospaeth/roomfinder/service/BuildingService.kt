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
    suspend fun getBuildingForRoom(
        roomName: String,
        buildingName: String? = null,
    ): Building? {
        return (buildingName ?: getBuildingNameForRoom(roomName))?.let { bName ->
            buildingRepository.findBuildingByName(bName)
                ?: buildingRepository.save(Building(name = bName)).also {
                    logger.info { "Creating new building $bName for room name: $roomName" }
                }
        }
    }

    // Extract by filter if not specified
    private fun getBuildingNameForRoom(roomName: String): String? {
        return roomName.firstOrNull { it.isLetter() }?.toString()
    }
}
