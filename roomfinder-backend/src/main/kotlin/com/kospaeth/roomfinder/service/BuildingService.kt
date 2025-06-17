package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.entities.Building
import com.kospaeth.roomfinder.data.repository.BuildingRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service

/**
 * Logger instance for logging events related to building operations.
 */
private val logger = KotlinLogging.logger {}

/**
 * Service class responsible for operations related to buildings.
 *
 * Provides functionality to retrieve or create buildings associated with rooms.
 */
@Service
class BuildingService(
    private val buildingRepository: BuildingRepository,
) {
    /**
     * Retrieves a building for the specified room.
     *
     * If a building name is provided, it will be used to search for the building.
     * If not, a building name will be inferred from the room name.
     * If no existing building is found, a new one will be created and saved.
     *
     * @param roomName The name of the room.
     * @param buildingName Optional name of the building. If null, the name is inferred from the room name.
     * @return The corresponding [Building] or null if a name could not be inferred.
     */
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

    /**
     * Infers a building name from a given room name.
     *
     * The first letter character of the room name is used as the building name.
     *
     * @param roomName The name of the room.
     * @return The inferred building name or null if no letter is found.
     */
    private fun getBuildingNameForRoom(roomName: String): String? {
        return roomName.firstOrNull { it.isLetter() }?.toString()
    }
}
