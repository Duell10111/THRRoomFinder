package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.service.RoomService
import com.kospaeth.roomfinder.service.splan.RoomSchedule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.MediaType.APPLICATION_JSON_VALUE
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@Tag(name = "Rooms API")
@RequestMapping(ControllerStruct.ROOM_CONTROLLER, produces = [APPLICATION_JSON_VALUE])
@RestController
class RoomController(
    private val roomService: RoomService,
) {
    @Operation(summary = "Fetch all rooms stored in the database.")
    @GetMapping("/")
    suspend fun getRooms(): List<RoomDTO> {
        return roomService.getAllRooms()
    }

    @Operation(
        summary = "Fetch all rooms stored in the database associated with their building name, e.g. A0.10 -> A building, Room A0.10.",
    )
    @GetMapping("/extended")
    suspend fun getRoomsExtended(): List<ExtendedRoomDTO> {
        return roomService.getAllRoomsWithBuildings()
    }

    @Operation(summary = "Get location of the specified room.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200"),
            ApiResponse(
                responseCode = "404",
                description = "No room found with the specified name.",
                content =
                    arrayOf(
                        Content(),
                    ),
            ),
        ],
    )
    @GetMapping("/{roomName}")
    suspend fun getLocationForRoom(
        @Parameter(description = "Room name to fetch location", required = true) @PathVariable roomName: String,
    ): ResponseEntity<RoomDTO> {
        return roomService.getLocationForRoom(roomName)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @Operation(summary = "Get schedules in the area of the room specified and all rooms available in the cache.")
    @GetMapping("/{roomName}/schedule/related")
    suspend fun getScheduleForRoomRelated(
        @Parameter(description = "Room name to use as base for related schedules", required = true) @PathVariable roomName: String,
    ): ResponseEntity<Map<String, List<RoomSchedule>>> {
        return roomService.getRelatedRoomScheduleForRoom(roomName = roomName)
            .let { ResponseEntity.ok(it.mapValues { it.value.schedule }) }
    }

    @Operation(summary = "Get schedules of the room specified for the current week, starting from Monday.")
    @GetMapping("/{roomName}/schedule")
    suspend fun getScheduleForRoom(
        @Parameter(description = "Room name to fetch schedule for", required = true) @PathVariable roomName: String,
    ): ResponseEntity<List<RoomSchedule>> {
        return roomService.getRoomScheduleForRoom(roomName).let {
            ResponseEntity.ok()
                .header("Updated-At", it.updatedAt.toString())
                .body(it.schedule)
        }
    }

    @Operation(summary = "Get schedules of the room specified for the week of the specified date, starting from Monday.")
    @GetMapping("/{roomName}/schedule/{date}")
    suspend fun getScheduleForRoomForDate(
        @Parameter(description = "Room name to fetch schedule for", required = true) @PathVariable roomName: String,
        @Parameter(description = "Date to fetch schedule for", required = true) @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") date:
            LocalDate,
    ): ResponseEntity<List<RoomSchedule>> {
        return roomService.getRoomScheduleForRoom(roomName, date).let { ResponseEntity.ok(it.schedule) }
    }
}
