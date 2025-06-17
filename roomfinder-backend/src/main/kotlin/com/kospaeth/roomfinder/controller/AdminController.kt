package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.service.AdminService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.security.SecurityScheme
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer",
)
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin API")
@RequestMapping(ControllerStruct.ADMIN_CONTROLLER)
@RestController
class AdminController(
    private val adminService: AdminService,
) {
    @Operation(summary = "Delete a room from the database")
    @ApiResponses(value = [ApiResponse(responseCode = "200", content = [Content()])])
    @DeleteMapping("/room/{roomName}")
    suspend fun deleteRoomEntry(
        @Parameter(description = "Room name to delete", required = true) @PathVariable roomName: String,
    ) {
        adminService.deleteRoomFromDatabase(roomName)
    }

    @Operation(summary = "Delete all rooms from the database")
    @ApiResponses(value = [ApiResponse(responseCode = "200", content = [Content()])])
    @DeleteMapping("/room")
    suspend fun deleteAllRooms() {
        adminService.deleteAllRoomsFromDatabase()
    }

    @Operation(summary = "Clear all cached schedules")
    @ApiResponses(value = [ApiResponse(responseCode = "200", content = [Content()])])
    @DeleteMapping("/schedules")
    suspend fun clearScheduleCache() {
        adminService.clearCachedSchedules()
    }
}
