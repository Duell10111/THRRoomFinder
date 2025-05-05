package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.repository.RoomRepository
import io.mockk.coVerify
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class AdminServiceTest() {
    @MockK(relaxed = true)
    private lateinit var roomRepository: RoomRepository

    @InjectMockKs
    private lateinit var adminService: AdminService

    @Test
    fun deleteRoomFromDatabase() =
        runTest {
            adminService.deleteRoomFromDatabase("room")
            coVerify(exactly = 1) { roomRepository.deleteRoomByName(eq("room")) }
        }

    @Test
    fun deleteAllRoomsFromDatabase() =
        runTest {
            adminService.deleteAllRoomsFromDatabase()
            coVerify(exactly = 1) { roomRepository.deleteAll() }
        }
}
