package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.service.AdminService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping(ControllerStruct.ADMIN_CONTROLLER)
@RestController
class AdminController(
    private val adminService: AdminService,
) {
    @DeleteMapping("/room/{roomName}")
    suspend fun deleteRoomEntry(
        @PathVariable roomName: String,
    ) {
        adminService.deleteRoomFromDatabase(roomName)
    }

    @DeleteMapping("/room")
    suspend fun deleteAllRooms() {
        adminService.deleteAllRoomsFromDatabase()
    }

    @DeleteMapping("/schedules")
    suspend fun clearScheduleCache() {
        adminService.clearCachedSchedules()
    }
}
