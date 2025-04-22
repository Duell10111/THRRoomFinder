package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.service.RoomService
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.time.LocalDate

@ExtendWith(MockKExtension::class)
class RoomControllerTest {
    @MockK(relaxed = true)
    private lateinit var roomService: RoomService

    @InjectMockKs private lateinit var roomController: RoomController

    @BeforeEach
    fun setUp() {
        // Mock Room Location function to be independent of OSM API
        coEvery { roomService.getLocationForRoom(any()) } returns
            RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0))

        coEvery { roomService.getAllRooms() } returns roomsList
        coEvery { roomService.getAllRoomsWithBuildings() } returns roomsBuildingList
        coEvery { roomService.getRoomScheduleForRoom(any(), any()) } returns emptyList()
    }

    @Test
    fun `test getRooms returns elements from RoomService`() =
        runTest {
            val rooms = roomController.getRooms()
            assertThat(rooms).containsExactlyInAnyOrderElementsOf(roomsList)
        }

    @Test
    fun `test getRoomsExtended returns elements from RoomService`() =
        runTest {
            val rooms = roomController.getRoomsExtended()
            assertThat(rooms).containsExactlyInAnyOrderElementsOf(roomsBuildingList)
        }

    @Test
    fun `test getScheduleForRoom returns elements from RoomService`() =
        runTest {
            val schedules = roomController.getScheduleForRoom("A0.10")
            assertThat(schedules.body!!).isEmpty()

            // TODO: Check if date is now()!
            coVerify(exactly = 1) { roomService.getRoomScheduleForRoom(eq("A0.10"), any()) }
        }

    @Test
    fun `test getScheduleForRoomForDate returns elements from RoomService`() =
        runTest {
            val date = LocalDate.now()
            val schedules = roomController.getScheduleForRoomForDate("A0.10", date)
            assertThat(schedules.body!!).isEmpty()

            coVerify(exactly = 1) { roomService.getRoomScheduleForRoom(eq("A0.10"), eq(date)) }
        }

    companion object {
        val roomsList =
            listOf(
                RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0)),
                RoomDTO(name = "A0.11", location = LocationDTO(lat = 12.0, lng = 25.0)),
            )
        val roomsBuildingList =
            listOf(
                ExtendedRoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0), buildingName = "A"),
                ExtendedRoomDTO(name = "A0.11", location = LocationDTO(lat = 12.0, lng = 25.0), buildingName = "A"),
            )
    }
}
