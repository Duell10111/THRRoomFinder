package com.kospaeth.roomfinder

import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import com.github.tomakehurst.wiremock.junit5.WireMockExtension
import com.kospaeth.roomfinder.config.OSMProperties
import com.kospaeth.roomfinder.config.SPlanProperties
import com.kospaeth.roomfinder.controller.ControllerStruct
import com.kospaeth.roomfinder.service.AdminService
import com.kospaeth.roomfinder.service.RoomService
import com.kospaeth.roomfinder.service.osm.OSMExtractorService
import com.ninjasquad.springmockk.MockkBean
import com.ninjasquad.springmockk.SpykBean
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.extension.RegisterExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.reactive.server.WebTestClient
import java.time.LocalDate

@ExtendWith(MockKExtension::class)
@ActiveProfiles("no-auth")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IntegrationTest : DatabaseTestBase() {
    @LocalServerPort
    var port: Int = 0

    private lateinit var webTestClient: WebTestClient

    @SpykBean
    private lateinit var osmProperties: OSMProperties

    @MockkBean
    private lateinit var sPlanProperties: SPlanProperties

    @SpykBean
    private lateinit var roomService: RoomService

    @SpykBean
    private lateinit var osmExtractorService: OSMExtractorService

    @Autowired
    private lateinit var adminService: AdminService

    @RegisterExtension
    val wireMockExtension: WireMockExtension =
        WireMockExtension.newInstance().options(wireMockConfig().dynamicPort()).build()

    @BeforeEach
    fun setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:$port").build()

        // Use wiremock instead of real apis
        coEvery { sPlanProperties.url } returns "${wireMockExtension.baseUrl()}/splan/json"
        coEvery { osmProperties.overPassUrl } returns "${wireMockExtension.baseUrl()}/api/interpreter"

        // Clear database
        runBlocking { adminService.deleteAllRoomsFromDatabase() }
    }

    @Test
    fun `test getRooms returns elements from service`() {
        // Prefill database with rooms fetched from osm
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)
    }

    @Test
    fun `test getRooms returns elements from service and cache is cleared after whole deletion`() {
        // Prefill database with rooms fetched from osm
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)

        webTestClient.delete().uri("${ControllerStruct.ADMIN_CONTROLLER}/room/")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(1)
    }

    @Test
    fun `test getRooms returns elements from service and cache is cleared after new element fetched`() {
        // Prefill database with rooms fetched from osm
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)

        webTestClient.delete().uri("${ControllerStruct.ADMIN_CONTROLLER}/room/")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(1)

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)
    }

    @Test
    fun `test getRoomsExtended returns elements from service`() {
        // Prefill database with rooms fetched from osm
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)
    }

    @Test
    fun `test getRoomsExtended returns elements from service and cache is cleared after whole deletion`() {
        // Prefill database with rooms fetched from osm
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)

        webTestClient.delete().uri("${ControllerStruct.ADMIN_CONTROLLER}/room/")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(1)
    }

    @Test
    fun `test getRoomsExtended returns elements from service and cache is cleared after new element fetched`() {
        // Prefill database with rooms fetched from osm
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)

        webTestClient.delete().uri("${ControllerStruct.ADMIN_CONTROLLER}/room/")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(1)

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.16")
            .exchange().expectStatus().isOk

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/extended")
            .exchange().expectStatus().isOk.expectBody().jsonPath("$.length()").isEqualTo(2)
    }

    @Test
    fun `test getLocationForRoom returns elements from service`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk.expectBody()
            .jsonPath("$.name").isEqualTo("A0.15")
            .jsonPath("$.location.lat").isEqualTo(47.86790245)
            .jsonPath("$.location.lng").isEqualTo(12.10714025)
    }

    @Test
    fun `test getLocationForRoom returns elements from service and calls osm only once`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk.expectBody()
            .jsonPath("$.name").isEqualTo("A0.15")
            .jsonPath("$.location.lat").isEqualTo(47.86790245)
            .jsonPath("$.location.lng").isEqualTo(12.10714025)

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.15")
            .exchange().expectStatus().isOk.expectBody()
            .jsonPath("$.name").isEqualTo("A0.15")
            .jsonPath("$.location.lat").isEqualTo(47.86790245)
            .jsonPath("$.location.lng").isEqualTo(12.10714025)

        coVerify(exactly = 1) { osmExtractorService.getIndoorRoomsForBuilding(any(), any()) }
    }

    @Test
    fun `test getLocationForRoom returns 404 if null returned from service`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.13")
            .exchange().expectStatus().isEqualTo(404)
    }

    @Test
    fun `test getScheduleForRoomRelated returns elements from cache`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/S-1.38/schedule")
            .exchange().expectStatus().isEqualTo(200).expectBody().jsonPath("$.length()").isEqualTo(1)

        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/S-1.37/schedule/related")
            .exchange().expectStatus().isEqualTo(200).expectBody()
            .jsonPath("$.length()").isEqualTo(3)
            .jsonPath("$.['S-1.38'].length()").isEqualTo(1)
            .jsonPath("$.['S-1.40'].length()").isEqualTo(0)
            .jsonPath("$.['S-1.43'].length()").isEqualTo(0)

        coVerify(exactly = 1) { roomService.getRoomScheduleForRoom(eq("S-1.38"), eq(LocalDate.now())) }
        coVerify(exactly = 1) { roomService.getRoomScheduleForRoom(eq("S-1.40"), eq(LocalDate.now())) }
        coVerify(exactly = 1) { roomService.getRoomScheduleForRoom(eq("S-1.43"), eq(LocalDate.now())) }
    }
}
