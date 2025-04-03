package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.config.OSMProperties
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.data.entities.Room
import com.kospaeth.roomfinder.data.entities.Source
import com.kospaeth.roomfinder.data.mapper.RoomMapper
import com.kospaeth.roomfinder.data.repository.RoomRepository
import com.kospaeth.roomfinder.service.osm.OSMExtractorService
import com.kospaeth.roomfinder.service.osm.locationPoint
import com.kospaeth.roomfinder.service.splan.RoomSchedule
import com.kospaeth.roomfinder.service.splan.StarPlanLocation
import com.kospaeth.roomfinder.service.splan.StarPlanService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service
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
    suspend fun getLocationForRoom(roomName: String): RoomDTO? {
        val roomData = roomRepository.findRoomByName(roomName) ?: fetchRoomFromOSM(roomName)
        return roomData?.let {
            roomMapper.toDTO(it)
        }
    }

    suspend fun getRoomScheduleForRoom(roomName: String): List<RoomSchedule> {
        return starPlanService.getScheduleForRoom(StarPlanLocation.RO, roomName)
    }

    // TODO: Only check once in specific time
    private suspend fun fetchRoomFromOSM(
        roomName: String,
        existingRoomDBId: UUID? = null,
    ): Room? {
        logger.info { "Fetching room from OSM: $roomName" }
        // TODO: get buildingWayIds by name prefix
        return osmProperties.buildingWayIds.firstNotNullOfOrNull { wayId ->
            osmExtractorService.getIndoorRoomsForBuilding(wayId, roomName)
        }?.let {
            val room =
                Room(
                    id = existingRoomDBId,
                    name = roomName,
                    location = it.locationPoint ?: return null,
                    source = Source.OSM,
                    updatedAt = LocalDateTime.now(),
                )
//            room
            saveRoom(room)
        }
    }

    private suspend fun saveRoom(room: Room): Room {
        return buildingService.getBuildingForRoom(room.name)?.let { building ->
            roomRepository.save(room.copy(buildingId = building.id))
        } ?: room
    }
}
