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
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

private val logger = KotlinLogging.logger {}

@Service
class RoomService(
    private val osmProperties: OSMProperties,
    private val roomMapper: RoomMapper,
    private val roomRepository: RoomRepository,
    private val buildingService: BuildingService,
    private val osmExtractorService: OSMExtractorService,
    private val starPlanService: StarPlanService,
) {
    @Cacheable("getAllRooms")
    suspend fun getAllRooms(): List<RoomDTO> {
        return roomRepository.findAll().map { roomMapper.toDTO(it) }.toList()
    }

    @Cacheable("getAllRoomsExtended")
    suspend fun getAllRoomsWithBuildings(): List<ExtendedRoomDTO> {
        return roomRepository.findAllRoomsWithBuildings().map { roomMapper.toDTO(it) }.toList()
    }

    suspend fun getLocationForRoom(roomName: String): RoomDTO? {
        val roomData = roomRepository.findRoomByName(roomName) ?: fetchRoomFromOSM(roomName)
        return roomData?.let {
            roomMapper.toDTO(it)
        }
    }

    // Fetches rooms related to the provided room name by checking the same building and floor
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

        // TODO: Matcher to get related rooms from availableRooms list

        // TODO: Fetch room schedule for related rooms,by cache only | only building and floor should match and checked without cache?
        return cacheSchedules + missingRooms
    }

    suspend fun getRoomScheduleForRoom(
        roomName: String,
        date: LocalDate = LocalDate.now(),
    ): SPlanScheduleList {
        return starPlanService.getScheduleForRoom(StarPlanLocation.RO, roomName, date)
    }

    // TODO: Only check once in specific time
    @CacheEvict("getAllRoomsExtended", "getAllRooms")
    protected suspend fun fetchRoomFromOSM(
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
                saveRoom(room, buildingProps.name)
            }
        }
    }

    private suspend fun saveRoom(
        room: Room,
        buildingName: String? = null,
    ): Room {
        return buildingService.getBuildingForRoom(room.name, buildingName)?.let { building ->
            roomRepository.save(room.copy(buildingId = building.id))
        } ?: room
    }

    private fun getRelatedFloorNames(
        roomName: String,
        roomList: List<String>,
    ): List<String> {
        val roomPrefix = roomName.substringBeforeLast(".")
        return roomList.filter { it.startsWith(roomPrefix) }
            .toList()
    }
}
