package com.kospaeth.roomfinder.security

import com.kospaeth.roomfinder.DatabaseTestBase
import com.kospaeth.roomfinder.controller.ControllerStruct
import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.service.RoomService
import com.ninjasquad.springmockk.SpykBean
import io.mockk.coEvery
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.test.web.reactive.server.WebTestClient

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WebSecurityConfigTest : DatabaseTestBase() {
    @LocalServerPort
    var port: Int = 0

    private lateinit var webTestClient: WebTestClient

    @SpykBean
    private lateinit var roomService: RoomService

    @BeforeEach
    fun setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:$port").build()

        // Mock Room Location function to be independent of OSM API
        coEvery { roomService.getLocationForRoom(any()) } returns
            RoomDTO(name = "A0.10", location = LocationDTO(lat = 10.0, lng = 20.0))
    }

    @Test
    fun `test actuator health accessable`() {
        webTestClient.get().uri("/actuator/health")
            .exchange().expectStatus().isOk
    }

    @Test
    fun `test root actuator endpoint not accessable`() {
        webTestClient.get().uri("/actuator")
            .exchange().expectStatus().is4xxClientError
    }

    @Test
    fun `test actuator heapdump not accessable`() {
        webTestClient.get().uri("/actuator/heapdump")
            .exchange().expectStatus().is4xxClientError
    }

    @Test
    fun `test room api accessable`() {
        webTestClient.get().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.10")
            .exchange().expectStatus().isOk
    }

    @Test
    fun `test room api cors preflight accessable`() {
        webTestClient.options().uri("${ControllerStruct.ROOM_CONTROLLER}/A0.10")
            .header(HttpHeaders.ORIGIN, "https://thrroomfinder.duell10111.de") // Simulated Frontend Origin
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, HttpMethod.GET.name())
            .exchange().expectStatus().isOk
            .expectHeader().valueEquals(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://thrroomfinder.duell10111.de")
            .expectHeader().valueEquals(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET,POST,OPTIONS,PUT,DELETE")
    }
}
