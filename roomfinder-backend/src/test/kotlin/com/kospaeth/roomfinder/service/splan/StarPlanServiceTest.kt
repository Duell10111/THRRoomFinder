package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import com.github.tomakehurst.wiremock.junit5.WireMockExtension
import com.github.tomakehurst.wiremock.junit5.WireMockTest
import com.kospaeth.roomfinder.config.SPlanProperties
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.netty.handler.logging.LogLevel
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.extension.RegisterExtension
import org.springframework.cache.Cache
import org.springframework.cache.CacheManager
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import reactor.netty.transport.logging.AdvancedByteBufFormat

@ExtendWith(MockKExtension::class)
@WireMockTest
class StarPlanServiceTest {
    @MockK
    private lateinit var cacheManager: CacheManager

    @MockK(relaxed = true)
    private lateinit var cache: Cache

    private lateinit var starPlanService: StarPlanService

    @RegisterExtension
    val wireMockExtension: WireMockExtension =
        WireMockExtension.newInstance().options(wireMockConfig().dynamicPort()).build()

    @BeforeEach
    fun setUp() {
        val properties = SPlanProperties("${wireMockExtension.baseUrl()}/splan/json")
        val httpClient =
            HttpClient
                .create()
                .wiretap(
                    "reactor.netty.http.client.HttpClient",
                    LogLevel.INFO,
                    AdvancedByteBufFormat.TEXTUAL,
                )
        every { cacheManager.getCache(any()) } returns cache
        every { cache.get(any(), AvailableRoomsCacheEntry::class.java) } returns null

        val webClient = WebClient.builder().clientConnector(ReactorClientHttpConnector(httpClient)).build()
        starPlanService = StarPlanService(webClient, properties, jacksonObjectMapper(), cacheManager)
    }

    // TODO: Add tests for cache extraction

    @Test
    fun testSPlanRoomSchedule() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.03")
            assertThat(rooms).isNotEmpty
        }

    @Test
    fun testSPlanRoomScheduleWithA001bc() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.01b")
            assertThat(rooms).isNotEmpty
        }

    @Test
    fun testSPlanRooms() =
        runTest {
            val rooms = starPlanService.getAvailableRooms(StarPlanLocation.RO)
            assertThat(rooms).isNotEmpty
        }
}
