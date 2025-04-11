package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.service.RoomService
import com.kospaeth.roomfinder.service.splan.RoomSchedule
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping(ControllerStruct.ROOM_CONTROLLER)
@RestController
class RoomController(
    private val roomService: RoomService,
) {
    @GetMapping("/")
    suspend fun getRooms(): List<RoomDTO> {
        return roomService.getAllRooms()
    }

    @GetMapping("/{roomName}")
    suspend fun getLocationForRoom(
        @PathVariable roomName: String,
    ): ResponseEntity<RoomDTO> {
        // TODO: Adapt for correct
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
}
