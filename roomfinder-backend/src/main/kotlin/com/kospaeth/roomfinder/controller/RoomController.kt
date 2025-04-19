package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.service.RoomService
import com.kospaeth.roomfinder.service.splan.RoomSchedule
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RequestMapping(ControllerStruct.ROOM_CONTROLLER)
@RestController
class RoomController(
    private val roomService: RoomService,
) {
    @GetMapping("/")
    suspend fun getRooms(): List<RoomDTO> {
        return roomService.getAllRooms()
    }

    @GetMapping("/extended")
    suspend fun getRoomsExtended(): List<ExtendedRoomDTO> {
        return roomService.getAllRoomsWithBuildings()
    }

    @GetMapping("/{roomName}")
    suspend fun getLocationForRoom(
        @PathVariable roomName: String,
    ): ResponseEntity<RoomDTO> {
        return roomService.getLocationForRoom(roomName)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @GetMapping("/{roomName}/schedule")
    suspend fun getScheduleForRoom(
        @PathVariable roomName: String,
    ): ResponseEntity<List<RoomSchedule>> {
        return roomService.getRoomScheduleForRoom(roomName).let { ResponseEntity.ok(it) }
    }

    @GetMapping("/{roomName}/schedule/{date}")
    suspend fun getScheduleForRoomForDate(
        @PathVariable roomName: String,
        @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") date: LocalDate,
    ): ResponseEntity<List<RoomSchedule>> {
        return roomService.getRoomScheduleForRoom(roomName, date).let { ResponseEntity.ok(it) }
    }
}
