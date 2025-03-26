package com.kospaeth.roomfinder.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping(ControllerStruct.ROOM_CONTROLLER)
@RestController
class RoomController {
    @GetMapping("/{roomName}")
    suspend fun getLocationForRoom(
        @PathVariable roomName: String,
    ): String {
        TODO("Implement")
    }
}
