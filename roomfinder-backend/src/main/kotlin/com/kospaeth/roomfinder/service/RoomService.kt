package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.config.OSMProperties
import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.data.entities.Room
import com.kospaeth.roomfinder.data.entities.Source
import com.kospaeth.roomfinder.data.mapper.RoomMapper
import com.kospaeth.roomfinder.data.repository.RoomRepository
import com.kospaeth.roomfinder.service.osm.OSMExtractorService
import com.kospaeth.roomfinder.service.osm.locationPoint
import com.kospaeth.roomfinder.service.splan.SPlanScheduleList
import com.kospaeth.roomfinder.service.splan.StarPlanLocation
import com.kospaeth.roomfinder.service.splan.StarPlanService
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

private val logger = KotlinLogging.logger {}

/**
 * Service class for managing room-related operations.
 *
 * Handles room retrieval, caching, enrichment with building data, and integration with
 * OSM and StarPlan services to provide room schedules and locations.
 */
@Service
class RoomService(
    private val osmProperties: OSMProperties,
    private val roomMapper: RoomMapper,
    private val roomRepository: RoomRepository,
    private val buildingService: BuildingService,
    private val osmExtractorService: OSMExtractorService,
    private val starPlanService: StarPlanService,
    cacheManager: CacheManager,
) {
    private val roomCache = cacheManager.getCache("rooms")
    private val roomExtendedCache = cacheManager.getCache("roomsExtended")

    /**
     * Retrieves all rooms as DTOs.
     *
     * Results are cached under the "rooms" cache name.
     *
     * @return A list of [RoomDTO] representing all rooms.
     */
    @Cacheable(cacheNames = ["rooms"])
    suspend fun getAllRooms(): List<RoomDTO> {
        return roomRepository.findAll().map { roomMapper.toDTO(it) }.toList()
    }

    /**
     * Retrieves all rooms along with their building data as DTOs.
     *
     * Results are cached under the "roomsExtended" cache name.
     *
     * @return A list of [ExtendedRoomDTO] with room and building information.
     */
    @Cacheable(cacheNames = ["roomsExtended"])
    suspend fun getAllRoomsWithBuildings(): List<ExtendedRoomDTO> {
        return roomRepository.findAllRoomsWithBuildings().map { roomMapper.toDTO(it) }.toList()
    }

    /**
     * Retrieves the location data for a room, either from the database or from OSM if not found.
     *
     * @param roomName The name of the room.
     * @return A [RoomDTO] with location data, or null if not available.
     */
    suspend fun getLocationForRoom(roomName: String): RoomDTO? {
        val roomData = roomRepository.findRoomByName(roomName) ?: fetchRoomFromOSM(roomName)
        return roomData?.let {
            roomMapper.toDTO(it)
        }
    }

    /**
     * Retrieves the schedule for rooms on the same floor as the specified room.
     *
     * Combines cached schedules with newly fetched schedules if necessary.
     *
     * @param location The [StarPlanLocation], defaults to RO.
     * @param roomName The room for which related schedules should be retrieved.
     * @return A map of room names to [SPlanScheduleList].
     */
    suspend fun getRelatedRoomScheduleForRoom(
        location: StarPlanLocation = StarPlanLocation.RO,
        roomName: String,
    ): Map<String, SPlanScheduleList> {
        val availableRooms = starPlanService.getAvailableRooms(location).map { it.shortName }
        val floorRooms = getRelatedFloorNames(roomName, availableRooms)

        val cacheSchedules = starPlanService.getCachedSchedulesForCurrentWeek(location)
        val missingRooms =
            floorRooms.filter { !cacheSchedules.containsKey(it) }
                .associateWith { getRoomScheduleForRoom(it, LocalDate.now()) }

        return cacheSchedules + missingRooms
    }

    /**
     * Retrieves the schedule for a single room from StarPlan.
     *
     * @param roomName The name of the room.
     * @param date The date for which to retrieve the schedule (defaults to today).
     * @return A [SPlanScheduleList] for the room and date.
     */
    suspend fun getRoomScheduleForRoom(
        roomName: String,
        date: LocalDate = LocalDate.now(),
    ): SPlanScheduleList {
        return starPlanService.getScheduleForRoom(StarPlanLocation.RO, roomName, date)
    }

    // TODO: Only check once in specific time

    /**
     * Attempts to fetch a room's location data from OpenStreetMap using building configuration.
     *
     * If successful, the room is saved and caches are cleared.
     *
     * @param roomName The name of the room.
     * @param existingRoomDBId Optional ID to reuse if updating an existing room.
     * @return The [Room] object, or null if no data was fetched.
     */
    suspend fun fetchRoomFromOSM(
        roomName: String,
        existingRoomDBId: UUID? = null,
    ): Room? {
        logger.info { "Fetching room from OSM: $roomName" }
        return osmProperties.buildingWayIds.find {
            roomName.matches(it.regexObject)
        }?.let { buildingProps ->
            logger.debug { "Found building configuration for room: $roomName" }
            osmExtractorService.getIndoorRoomsForBuilding(buildingProps.buildingId, roomName)?.let {
                val room =
                    Room(
                        id = existingRoomDBId,
                        name = roomName,
                        location = it.locationPoint ?: return null,
                        source = Source.OSM,
                        updatedAt = LocalDateTime.now(),
                    )
                runCatching {
                    saveRoom(room, buildingProps.name)
                }.onFailure {
                    logger.error(it) { "Failed to save room: $roomName" }
                }.getOrDefault(room)
                    .also {
                        // Clear caches
                        roomCache?.clear()
                        roomExtendedCache?.clear()
                    }
            }
        }
    }

    /**
     * Saves the room to the repository, optionally linking it to a building.
     *
     * @param room The room to be saved.
     * @param buildingName Optional name of the building to associate with the room.
     * @return The saved [Room] object.
     */
    private suspend fun saveRoom(
        room: Room,
        buildingName: String? = null,
    ): Room {
        return buildingService.getBuildingForRoom(room.name, buildingName)?.let { building ->
            roomRepository.save(room.copy(buildingId = building.id))
        } ?: room
    }

    /**
     * Filters a list of room names to find those on the same floor as the specified room.
     *
     * A room is considered on the same floor if it shares the same prefix before the last '.'.
     *
     * @param roomName The reference room name.
     * @param roomList The list of room names to filter.
     * @return A list of room names on the same floor.
     */
    private fun getRelatedFloorNames(
        roomName: String,
        roomList: List<String>,
    ): List<String> {
        val roomPrefix = roomName.substringBeforeLast(".")
        return roomList.filter { it.startsWith(roomPrefix) }
            .toList()
    }
}
