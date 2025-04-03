package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import com.github.tomakehurst.wiremock.junit5.WireMockExtension
import com.github.tomakehurst.wiremock.junit5.WireMockTest
import com.kospaeth.roomfinder.config.SPlanProperties
import io.netty.handler.logging.LogLevel
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.RegisterExtension
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import reactor.netty.transport.logging.AdvancedByteBufFormat

@WireMockTest
class StarPlanServiceTest{

    private lateinit var starPlanService: StarPlanService

    @RegisterExtension
    val wireMockExtension: WireMockExtension =
        WireMockExtension.newInstance().options(wireMockConfig().dynamicPort()).build()

    @BeforeEach
    fun setUp() {
        val properties = SPlanProperties("${wireMockExtension.baseUrl()}/splan/json")
        val httpClient = HttpClient
            .create()
            .wiretap(
                "reactor.netty.http.client.HttpClient",
                LogLevel.INFO, AdvancedByteBufFormat.TEXTUAL
            )
        val webClient = WebClient.builder().clientConnector(ReactorClientHttpConnector(httpClient)).build()
        starPlanService = StarPlanService(webClient, properties, jacksonObjectMapper())
    }

    @Test
    fun testSPlanRoomSchedule() = runTest {
        val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.03")
        assertThat(rooms).isNotEmpty
    }

     @Test
     fun testSPlanRooms() = runTest {
        val rooms = starPlanService.getAvailableRooms(StarPlanLocation.RO)
        assertThat(rooms).isNotEmpty
     }

 }
