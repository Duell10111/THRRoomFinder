package com.kospaeth.roomfinder

import com.kospaeth.roomfinder.controller.ControllerStruct
import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.service.RoomService
import com.ninjasquad.springmockk.MockkBean
import io.mockk.coEvery
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.reactive.server.WebTestClient

@ActiveProfiles("no-auth")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IntegrationTest : DatabaseTestBase() {
    // TODO: Integrate Wiremock to not use real apis

    @LocalServerPort
    var port: Int = 0

    private lateinit var webTestClient: WebTestClient

    @MockkBean
    private lateinit var roomService: RoomService

    @BeforeEach
    fun setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:$port").build()

        // TODO: Use less mocks here

        coEvery { roomService.getAllRoomsWithBuildings() } returns roomsBuildingList
        // Mock Room Location function to be independent of OSM API
        coEvery { roomService.getLocationForRoom(any()) } returns null
        coEvery { roomService.getLocationForRoom(eq("A0.10")) } returns
            RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0))
    }

    @Test
    fun `test getRoomsExtended returns elements from service`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)
    }

    @Test
    fun `test getLocationForRoom returns elements from service`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.10")
            .exchange().expectStatus().isOk.expectBody()
            .jsonPath("$.name").isEqualTo("A0.10")
            .jsonPath("$.location.lat").isEqualTo(10.0)
            .jsonPath("$.location.lng").isEqualTo(20.0)
    }

    @Test
    fun `test getLocationForRoom returns 404 if null returned from service`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.13")
            .exchange().expectStatus().isEqualTo(404)
    }

    companion object {
        val roomsBuildingList =
            listOf(
                ExtendedRoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0), buildingName = "A"),
                ExtendedRoomDTO(name = "A0.11", location = LocationDTO(lat = 12.0, lng = 25.0), buildingName = "A"),
            )
    }
}
