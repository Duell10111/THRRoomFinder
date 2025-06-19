package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.config.OSMBuildingProperties
import com.kospaeth.roomfinder.config.OSMProperties
import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.data.entities.Building
import com.kospaeth.roomfinder.data.entities.Room
import com.kospaeth.roomfinder.data.entities.RoomWithBuildingData
import com.kospaeth.roomfinder.data.entities.Source
import com.kospaeth.roomfinder.data.mapper.RoomMapper
import com.kospaeth.roomfinder.data.repository.RoomRepository
import com.kospaeth.roomfinder.service.osm.Element
import com.kospaeth.roomfinder.service.osm.OSMExtractorService
import com.kospaeth.roomfinder.service.osm.OverpassResponse
import com.kospaeth.roomfinder.service.splan.RoomSchedule
import com.kospaeth.roomfinder.service.splan.SPlanRoomResponseItem
import com.kospaeth.roomfinder.service.splan.SPlanScheduleList
import com.kospaeth.roomfinder.service.splan.StarPlanLocation
import com.kospaeth.roomfinder.service.splan.StarPlanService
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mapstruct.factory.Mappers
import org.springframework.cache.CacheManager
import org.springframework.data.geo.Point
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

@ExtendWith(MockKExtension::class)
class RoomServiceTest {
    @MockK(relaxed = true)
    private lateinit var osmProperties: OSMProperties

    // Injected with @InjectMockKs
    private var roomMapper: RoomMapper = Mappers.getMapper(RoomMapper::class.java)

    @MockK(relaxed = true)
    private lateinit var roomRepository: RoomRepository

    @MockK(relaxed = true)
    private lateinit var osmExtractorService: OSMExtractorService

    @MockK(relaxed = true)
    private lateinit var buildingService: BuildingService

    @MockK(relaxed = true)
    private lateinit var starPlanService: StarPlanService

    @MockK(relaxed = true)
    private lateinit var cacheManager: CacheManager

    @InjectMockKs private lateinit var roomService: RoomService

    @BeforeEach
    fun setUp() {
    }

    @Test
    fun `getAllRooms should return empty list when no rooms are found in the database`() =
        runTest {
            every { roomRepository.findAll() } returns emptyList<Room>().asFlow()

            assertThat(roomService.getAllRooms()).isEmpty()
        }

    @Test
    fun `getAllRooms should return a list of rooms when the database has rooms`() =
        runTest {
            every { roomRepository.findAll() } returns
                roomsList.asFlow()

            val rooms = roomService.getAllRooms()

            assertThat(rooms).containsExactlyInAnyOrder(
                RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0)),
                RoomDTO(name = "A0.11", location = LocationDTO(lat = 12.0, lng = 25.0)),
            )
        }

    @Test
    fun `getAllRoomsWithBuildings should return empty list when no rooms are found in the database`() =
        runTest {
            every { roomRepository.findAllRoomsWithBuildings() } returns emptyList<RoomWithBuildingData>().asFlow()

            assertThat(roomService.getAllRooms()).isEmpty()
        }

    @Test
    fun `getAllRoomsWithBuildings should return a list of rooms when the database has rooms`() =
        runTest {
            every { roomRepository.findAllRoomsWithBuildings() } returns
                roomsBuildingList.asFlow()

            val rooms = roomService.getAllRoomsWithBuildings()

            assertThat(rooms).containsExactlyInAnyOrder(
                ExtendedRoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0), buildingName = "A"),
                ExtendedRoomDTO(name = "A0.11", location = LocationDTO(lat = 12.0, lng = 25.0), buildingName = "A"),
            )
        }

    @Test
    fun `getLocationForRoom should return a room when the database has the room`() =
        runTest {
            coEvery { roomRepository.findRoomByName(eq("A0.10")) } returns
                Room(name = "A0.10", location = Point(10.0, 20.0), source = Source.OSM)

            val room = roomService.getLocationForRoom("A0.10")

            assertThat(room).isEqualTo(
                RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0)),
            )

            coVerify(exactly = 0) { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) }
        }

    @Test
    fun `getLocationForRoom should return a room and ask osmExtractorService if no database entry exists`() =
        runTest {
            coEvery { roomRepository.findRoomByName(eq("A0.10")) } returns null

            every { osmProperties.buildingWayIds } returns
                listOf(
                    OSMBuildingProperties(
                        regex = "A\\d\\.\\d{0,2}\\w?",
                        buildingId = "areaId",
                        name = "A",
                    ),
                )
            val response =
                OverpassResponse(
                    elements =
                        listOf(
                            Element(
                                id = 1000,
                                type = "type",
                                tags =
                                    mapOf(
                                        "indoor" to "room",
                                    ),
                                nodes = listOf(1001),
                            ),
                            Element(
                                lat = 10.0,
                                lon = 20.0,
                                id = 1001,
                                type = "type",
                                nodes = listOf(),
                            ),
                        ),
                )
            coEvery { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) } returns
                response
            coEvery { buildingService.getBuildingForRoom(any(), any()) } returns
                Building(name = "A")
            coEvery { roomRepository.save(any()) } returnsArgument (0)

            val room = roomService.getLocationForRoom("A0.10")

            assertThat(room).isEqualTo(
                RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0)),
            )

            coVerify(exactly = 1) { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) }
            coVerify(exactly = 1) { roomRepository.save(any()) }
        }

    @Suppress("ktlint:standard:max-line-length")
    @Test
    fun `getLocationForRoom should return a room and ask osmExtractorService if no database entry exists and no building is available`() =
        runTest {
            coEvery { roomRepository.findRoomByName(eq("A0.10")) } returns null

            every { osmProperties.buildingWayIds } returns
                listOf(
                    OSMBuildingProperties(
                        regex = "A\\d\\.\\d{0,2}\\w?",
                        buildingId = "areaId",
                        name = "A",
                    ),
                )
            val response =
                OverpassResponse(
                    elements =
                        listOf(
                            Element(
                                id = 1000,
                                type = "type",
                                tags =
                                    mapOf(
                                        "indoor" to "room",
                                    ),
                                nodes = listOf(1001),
                            ),
                            Element(
                                lat = 10.0,
                                lon = 20.0,
                                id = 1001,
                                type = "type",
                                nodes = listOf(),
                            ),
                        ),
                )
            coEvery { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) } returns
                response
            coEvery { buildingService.getBuildingForRoom(any(), any()) } returns
                null

            val room = roomService.getLocationForRoom("A0.10")

            assertThat(room).isEqualTo(
                RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0)),
            )

            coVerify(exactly = 1) { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) }
            coVerify(exactly = 0) { roomRepository.save(any()) }
        }

    @Suppress("ktlint:standard:max-line-length")
    @Test
    fun `getLocationForRoom should return a room and ask osmExtractorService if no database entry exists and return osm value on database error`() =
        runTest {
            coEvery { roomRepository.findRoomByName(eq("A0.10")) } returns null

            every { osmProperties.buildingWayIds } returns
                listOf(
                    OSMBuildingProperties(
                        regex = "A\\d\\.\\d{0,2}\\w?",
                        buildingId = "areaId",
                        name = "A",
                    ),
                )
            val response =
                OverpassResponse(
                    elements =
                        listOf(
                            Element(
                                id = 1000,
                                type = "type",
                                tags =
                                    mapOf(
                                        "indoor" to "room",
                                    ),
                                nodes = listOf(1001),
                            ),
                            Element(
                                lat = 10.0,
                                lon = 20.0,
                                id = 1001,
                                type = "type",
                                nodes = listOf(),
                            ),
                        ),
                )
            coEvery { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) } returns
                response
            coEvery { buildingService.getBuildingForRoom(any(), any()) } returns
                Building(name = "A")
            coEvery { roomRepository.save(any()) } throws Exception("Some database error")

            val room = roomService.getLocationForRoom("A0.10")

            assertThat(room).isEqualTo(
                RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0)),
            )

            coVerify(exactly = 1) { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) }
            coVerify(exactly = 1) { roomRepository.save(any()) }
        }

    @Test
    fun `getLocationForRoom should return null and ask osmExtractorService if no database entry exists with no building ids set`() =
        runTest {
            coEvery { roomRepository.findRoomByName(eq("A0.10")) } returns null

            every { osmProperties.buildingWayIds } returns
                emptyList()
            coEvery { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) } returns
                null

            val room = roomService.getLocationForRoom("A0.10")

            assertThat(room).isEqualTo(null)

            coVerify(exactly = 0) { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) }
        }

    @Test
    fun `getLocationForRoom should return null and ask osmExtractorService if no database entry exists with no valid osm response`() =
        runTest {
            coEvery { roomRepository.findRoomByName(eq("A0.10")) } returns null

            every { osmProperties.buildingWayIds } returns
                listOf(
                    OSMBuildingProperties(
                        regex = "A\\d\\.\\d{0,2}\\w?",
                        buildingId = "areaId",
                        name = "A",
                    ),
                )
            coEvery { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) } returns
                null

            val room = roomService.getLocationForRoom("A0.10")

            assertThat(room).isEqualTo(null)

            coVerify(exactly = 1) { osmExtractorService.getIndoorRoomsForBuilding(eq("areaId"), eq("A0.10")) }
        }

    @Test
    fun `getRoomScheduleForRoom should return a room schedule fetched from starplan service`() =
        runTest {
            coEvery { starPlanService.getScheduleForRoom(StarPlanLocation.RO, any(), any()) } returns
                sPlanScheduleList

            val schedule = roomService.getRoomScheduleForRoom("A0.10")

            coVerify(exactly = 1) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, any(), eq(LocalDate.now())) }

            assertThat(schedule).isEqualTo(sPlanScheduleList)
        }

    @Test
    fun `getRelatedRoomScheduleForRoom should return cached schedules and missing floor schedules fetched from starplan service`() =
        runTest {
            coEvery { starPlanService.getAvailableRooms(any()) } returns
                availableRooms

            coEvery { starPlanService.getCachedSchedulesForCurrentWeek(StarPlanLocation.RO) } returns
                mapOf(
                    "A1.01" to sPlanScheduleList,
                )
            coEvery { starPlanService.getScheduleForRoom(StarPlanLocation.RO, any(), any()) } returns
                sPlanScheduleList

            val scheduleMap = roomService.getRelatedRoomScheduleForRoom(roomName = "A1.01")

            assertThat(scheduleMap.size).isEqualTo(4)
            assertThat(scheduleMap["A1.01"]).isEqualTo(sPlanScheduleList)
            assertThat(scheduleMap["A1.02"]).isEqualTo(sPlanScheduleList)
            assertThat(scheduleMap["A1.03"]).isEqualTo(sPlanScheduleList)
            assertThat(scheduleMap["A1.05"]).isEqualTo(sPlanScheduleList)

            coVerify(exactly = 0) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A1.01"), eq(LocalDate.now())) }
            coVerify(exactly = 1) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A1.02"), eq(LocalDate.now())) }
            coVerify(exactly = 1) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A1.03"), eq(LocalDate.now())) }
            coVerify(exactly = 1) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A1.05"), eq(LocalDate.now())) }
        }

    @Test
    fun `getRelatedRoomScheduleForRoom should only return related rooms and cached ones`() =
        runTest {
            coEvery { starPlanService.getAvailableRooms(any()) } returns
                availableRooms

            coEvery { starPlanService.getCachedSchedulesForCurrentWeek(StarPlanLocation.RO) } returns
                mapOf(
                    "A1.01" to sPlanScheduleList,
                )
            coEvery { starPlanService.getScheduleForRoom(StarPlanLocation.RO, any(), any()) } returns
                sPlanScheduleList

            val scheduleMap = roomService.getRelatedRoomScheduleForRoom(roomName = "A0.10")

            assertThat(scheduleMap.size).isEqualTo(2)
            assertThat(scheduleMap["A0.10"]).isEqualTo(sPlanScheduleList)
            assertThat(scheduleMap["A1.01"]).isEqualTo(sPlanScheduleList)

            coVerify(exactly = 0) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A1.01"), eq(LocalDate.now())) }
            coVerify(exactly = 1) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A0.10"), eq(LocalDate.now())) }
        }

    @Test
    fun `getRelatedRoomScheduleForRoom should return only cached schedules when no related rooms exists`() =
        runTest {
            coEvery { starPlanService.getAvailableRooms(any()) } returns
                availableRooms

            coEvery { starPlanService.getCachedSchedulesForCurrentWeek(StarPlanLocation.RO) } returns
                mapOf(
                    "A1.01" to sPlanScheduleList,
                )
            coEvery { starPlanService.getScheduleForRoom(StarPlanLocation.RO, any(), any()) } returns
                sPlanScheduleList

            val scheduleMap = roomService.getRelatedRoomScheduleForRoom(roomName = "Z0.10")

            assertThat(scheduleMap.size).isEqualTo(1)
            assertThat(scheduleMap["A1.01"]).isEqualTo(sPlanScheduleList)

            coVerify(exactly = 0) { starPlanService.getScheduleForRoom(StarPlanLocation.RO, eq("A1.01"), eq(LocalDate.now())) }
            coVerify(exactly = 0) { starPlanService.getScheduleForRoom(any(), any(), any()) }
        }

    companion object {
        val roomsList =
            listOf(
                Room(
                    name = "A0.10",
                    location = Point(10.0, 20.0),
                    displayName = null,
                    source = Source.OSM,
                    buildingId = UUID.fromString("25db57aa-c623-409c-9a06-3975b4b3ab8a"),
                ),
                Room(
                    name = "A0.11",
                    location = Point(12.0, 25.0),
                    displayName = "Displayname",
                    source = Source.UNKNOWN,
                    buildingId = UUID.fromString("25db57aa-c623-409c-9a06-3975b4b3ab8a"),
                ),
            )
        val roomsBuildingList =
            listOf(
                RoomWithBuildingData(
                    id = UUID.randomUUID(),
                    name = "A0.10",
                    location = Point(10.0, 20.0),
                    displayName = null,
                    buildingId = UUID.fromString("25db57aa-c623-409c-9a06-3975b4b3ab8a"),
                    buildingName = "A",
                ),
                RoomWithBuildingData(
                    id = UUID.randomUUID(),
                    name = "A0.11",
                    location = Point(12.0, 25.0),
                    displayName = "Displayname",
                    buildingId = UUID.fromString("25db57aa-c623-409c-9a06-3975b4b3ab8a"),
                    buildingName = "A",
                ),
            )
        val availableRooms =
            listOf(
                SPlanRoomResponseItem(
                    10,
                    "A0.10",
                    "A0.10",
                ),
                SPlanRoomResponseItem(
                    11,
                    "A1.01",
                    "Physik-Praktikum: Grundlagen",
                ),
                SPlanRoomResponseItem(
                    12,
                    "A1.02",
                    "Physik-Praktikum: Grundlagen",
                ),
                SPlanRoomResponseItem(
                    13,
                    "A1.03",
                    "HÃ¶rsaal (Physik)",
                ),
                SPlanRoomResponseItem(
                    14,
                    "A1.05",
                    "HÃ¶rsaal (Chemie)",
                ),
            )
        val sPlanScheduleList =
            SPlanScheduleList(
                listOf(
                    RoomSchedule(
                        location = StarPlanLocation.RO,
                        room = "",
                        name = "Vorlesungsfrei / no lectures",
                        lecturer = "Tag der Arbeit",
                        relevantDegrees = null,
                        startTime = LocalDateTime.parse("2025-05-01T08:00"),
                        endTime = LocalDateTime.parse("2025-05-01T20:00"),
                    ),
                ),
                LocalDateTime.of(2025, 5, 1, 10, 0),
            )
    }
}
