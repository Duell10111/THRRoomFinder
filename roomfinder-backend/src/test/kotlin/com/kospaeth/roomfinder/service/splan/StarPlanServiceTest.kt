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
import java.time.LocalDateTime

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

    companion object {
        val a001bRooms =
            listOf(
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Grundlagen der Bauphysik",
                    lecturer = "Praktikum, Prof.Dr. Johannes Aschaber",
                    relevantDegrees = "IPB-B2",
                    startTime = LocalDateTime.parse("2025-04-07T11:45"),
                    endTime = LocalDateTime.parse("2025-04-07T13:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Physik Praktikum",
                    lecturer = "Prof.Dr. Silke Stanzel",
                    relevantDegrees = "MEC-B2",
                    startTime = LocalDateTime.parse("2025-04-07T11:45"),
                    endTime = LocalDateTime.parse("2025-04-07T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Grundlagen der Bauphysik",
                    lecturer = "Praktikum, Prof.Dr. Johannes Aschaber",
                    relevantDegrees = "IPB-B2",
                    startTime = LocalDateTime.parse("2025-04-07T13:45"),
                    endTime = LocalDateTime.parse("2025-04-07T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Grundlagen der Bauphysik 2 - Praktikum, Grundlagen der Bauphysik 2 - Praktikum",
                    lecturer = "Prof.Dr. Gerhard Friedsam",
                    relevantDegrees = "BI-B2, HA-B2",
                    startTime = LocalDateTime.parse("2025-04-07T15:30"),
                    endTime = LocalDateTime.parse("2025-04-07T18:45"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Angewandte Physik Praktikum",
                    lecturer = "Dipl.-Phys.Univ Manuel Poller",
                    relevantDegrees = "EGT-B2",
                    startTime = LocalDateTime.parse("2025-04-08T11:45"),
                    endTime = LocalDateTime.parse("2025-04-08T13:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Angewandte Physik Praktikum",
                    lecturer = "Dipl.-Phys.Univ Manuel Poller",
                    relevantDegrees = "EGT-B2",
                    startTime = LocalDateTime.parse("2025-04-08T13:45"),
                    endTime = LocalDateTime.parse("2025-04-08T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Grundlagen der Bauphysik 2 - Praktikum, Grundlagen der Bauphysik 2 - Praktikum",
                    lecturer = "Prof.Dr. Gerhard Friedsam",
                    relevantDegrees = "BI-B2, HA-B2",
                    startTime = LocalDateTime.parse("2025-04-08T15:30"),
                    endTime = LocalDateTime.parse("2025-04-08T18:45"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Physik 1",
                    lecturer = "Prof.Dr. Robert Kellner",
                    relevantDegrees = "MB-B2",
                    startTime = LocalDateTime.parse("2025-04-08T15:30"),
                    endTime = LocalDateTime.parse("2025-04-08T18:45"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Praktikum Grundlagen der Bauphysik, Grundlagen der Bauphysik",
                    lecturer = "Prof.Dr. Robert Kellner",
                    relevantDegrees = "HT-B2, IWT-B3",
                    startTime = LocalDateTime.parse("2025-04-09T13:45"),
                    endTime = LocalDateTime.parse("2025-04-09T17:00"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Praktikum Grundlagen der Bauphysik, Grundlagen der Bauphysik",
                    lecturer = "Prof.Dr. Robert Kellner",
                    relevantDegrees = "HT-B2, IWT-B3",
                    startTime = LocalDateTime.parse("2025-04-09T17:15"),
                    endTime = LocalDateTime.parse("2025-04-09T20:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Physik 1",
                    lecturer = "Prof.Dr. Johannes Aschaber",
                    relevantDegrees = "MB-B2",
                    startTime = LocalDateTime.parse("2025-04-10T13:45"),
                    endTime = LocalDateTime.parse("2025-04-10T17:00"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.01b",
                    name = "Physik Praktikum, Physik 1 Praktikum, Physik 1 Praktikum",
                    lecturer = "Dr.rer.nat. Michael Griesbeck",
                    relevantDegrees = "KT-B2, MT-B2, NPT-B2",
                    startTime = LocalDateTime.parse("2025-04-11T13:45"),
                    endTime = LocalDateTime.parse("2025-04-11T18:45"),
                ),
            )

        val a003Rooms =
            listOf(
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Embedded Systems, Embedded Systems, Embedded Systems",
                    lecturer = "Prof.Dr. Wolfgang Mühlbauer",
                    relevantDegrees = "AAI-B/FWPM, INF-B/FWPM, WIF-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-07T11:45"),
                    endTime = LocalDateTime.parse("2025-04-07T13:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Grafische Oberflächen, Grafische Oberflächen, Grafische Oberflächen",
                    lecturer = "Veronika Dashuber",
                    relevantDegrees = "AAI-B/FWPM, INF-B/FWPM, WIF-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-07T13:45"),
                    endTime = LocalDateTime.parse("2025-04-07T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Logistik Übungen, Logistik Übungen",
                    lecturer = "Prof.Dr. Bernhard Holaubek",
                    relevantDegrees = "INF-B/FWPM, WIF-B4",
                    startTime = LocalDateTime.parse("2025-04-08T09:45"),
                    endTime = LocalDateTime.parse("2025-04-08T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Software-Engineering-Praxis Übung",
                    lecturer = "A. Magerl, Prof.Dr. Gerd Beneken",
                    relevantDegrees = "INF-B6",
                    startTime = LocalDateTime.parse("2025-04-08T11:45"),
                    endTime = LocalDateTime.parse("2025-04-08T13:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Entwicklung von Computerspielen, Entwicklung von Computerspielen, Entwicklung von Computerspielen",
                    lecturer = "Andreas Magerl",
                    relevantDegrees = "AAI-B/FWPM, INF-B/FWPM, WIF-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-08T13:45"),
                    endTime = LocalDateTime.parse("2025-04-08T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Entwicklung von Computerspielen, Entwicklung von Computerspielen, Entwicklung von Computerspielen",
                    lecturer = "Andreas Magerl",
                    relevantDegrees = "AAI-B/FWPM, INF-B/FWPM, WIF-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-08T15:30"),
                    endTime = LocalDateTime.parse("2025-04-08T17:00"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Object-Oriented Programming Exercise",
                    lecturer = "Kevin Burmann",
                    relevantDegrees = "AAI-B2",
                    startTime = LocalDateTime.parse("2025-04-09T09:45"),
                    endTime = LocalDateTime.parse("2025-04-09T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Object-Oriented Programming Exercise",
                    lecturer = "Prof.Dr. Kai Höfig",
                    relevantDegrees = "AAI-B2",
                    startTime = LocalDateTime.parse("2025-04-09T12:00"),
                    endTime = LocalDateTime.parse("2025-04-09T13:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Object-Oriented Programming Exercise",
                    lecturer = "Prof.Dr. Kai Höfig",
                    relevantDegrees = "AAI-B2",
                    startTime = LocalDateTime.parse("2025-04-09T13:45"),
                    endTime = LocalDateTime.parse("2025-04-09T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Übungen zu IT-Systeme",
                    lecturer = "Prof.Dr. Kai Höfig",
                    relevantDegrees = "INF-B2",
                    startTime = LocalDateTime.parse("2025-04-10T12:00"),
                    endTime = LocalDateTime.parse("2025-04-10T13:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A0.03",
                    name = "Übungen zu IT-Systeme",
                    lecturer = "Prof.Dr. Kai Höfig",
                    relevantDegrees = "INF-B2",
                    startTime = LocalDateTime.parse("2025-04-10T13:45"),
                    endTime = LocalDateTime.parse("2025-04-10T15:15"),
                ),
            )
    }

    // TODO: Add tests for cache extraction

    @Test
    fun `test getScheduleForRoom with non-parallel calendar entries`() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.03")
            assertThat(rooms).hasSize(11)
            assertThat(rooms).containsExactlyInAnyOrderElementsOf(a003Rooms)
        }

    @Test
    fun `test getScheduleForRoom with parallel calendar entries`() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.01b")
            assertThat(rooms).hasSize(12)
            assertThat(rooms).containsExactlyInAnyOrderElementsOf(a001bRooms)
        }

    @Test
    fun `test getAvailableRooms for RO Location`() =
        runTest {
            val rooms = starPlanService.getAvailableRooms(StarPlanLocation.RO)
            assertThat(rooms).hasSize(228)
            // TODO: Add more test asserts
        }
}
