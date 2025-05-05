package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.service.AdminService
import io.mockk.coVerify
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class AdminControllerTest {
    @MockK(relaxed = true)
    private lateinit var adminService: AdminService

    @InjectMockKs private lateinit var adminController: AdminController

    @Test
    fun `test get deleteRoomEntry works correctly`() =
        runTest {
            adminController.deleteRoomEntry("roomName")

            coVerify { adminService.deleteRoomFromDatabase("roomName") }
        }

    @Test
    fun `test get deleteAllRooms works correctly`() =
        runTest {
            adminController.deleteAllRooms()

            coVerify { adminService.deleteAllRoomsFromDatabase() }
        }
}
