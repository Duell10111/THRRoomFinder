package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import com.github.tomakehurst.wiremock.junit5.WireMockExtension
import com.github.tomakehurst.wiremock.junit5.WireMockTest
import com.kospaeth.roomfinder.config.SPlanProperties
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import io.netty.handler.logging.LogLevel
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.extension.RegisterExtension
import org.springframework.cache.CacheManager
import org.springframework.cache.caffeine.CaffeineCache
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import reactor.netty.transport.logging.AdvancedByteBufFormat
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.WeekFields

@ExtendWith(MockKExtension::class)
@WireMockTest
class StarPlanServiceTest {
    @MockK
    private lateinit var cacheManager: CacheManager

    @MockK(relaxed = true)
    private lateinit var cache: CaffeineCache

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
        // Cache mocking
        every { cacheManager.getCache(any()) } returns cache
        every { cache.get(any(), AvailableRoomsCacheEntry::class.java) } returns null
        every { cache.get(any(), SPlanScheduleList::class.java) } returns null

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

        @Suppress("ktlint:standard:max-line-length")
        val a103Rooms =
            listOf(
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Gebäudetechnik - Elektro, Gebäudetechnik - Elektro, Gebäudetechnik - Elektro",
                    lecturer = "Prof.Dr. Michael Krödel",
                    relevantDegrees = "BI-B/FWPM, HA-B6, HA-B7, IAB-B3, IAB-B4",
                    startTime = LocalDateTime.parse("2025-03-31T08:00"),
                    endTime = LocalDateTime.parse("2025-03-31T09:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Grundlagen der Bauphysik",
                    lecturer = "Prof.Dr. Johannes Aschaber",
                    relevantDegrees = "IPB-B2",
                    startTime = LocalDateTime.parse("2025-03-31T09:45"),
                    endTime = LocalDateTime.parse("2025-03-31T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Grundlagen der Bauphysik 2",
                    lecturer = "Prof.Dr. Gerhard Friedsam, Prof.Dr. Andreas Rabold",
                    relevantDegrees = "BI-B2",
                    startTime = LocalDateTime.parse("2025-03-31T11:45"),
                    endTime = LocalDateTime.parse("2025-03-31T13:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Konstruktive Bauphysik - Feuchte-, Wärme-, Schallschutz, Konstruktive Bauphysik - Feuchte-, Wärme-, Schallschutz",
                    lecturer = "Prof.Dr. Gerhard Friedsam, Prof.Dr. Andreas Rabold",
                    relevantDegrees = "BI-B3, HA-B3, HA-B4",
                    startTime = LocalDateTime.parse("2025-03-31T13:45"),
                    endTime = LocalDateTime.parse("2025-03-31T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Gebäudekonstruktion, Gebäudekonstruktion",
                    lecturer = "Dipl.-Ing. Jonas Kessler, Prof.Dipl.Ing. Martin Kühfuß",
                    relevantDegrees = "EGT-B2, IFM-B2",
                    startTime = LocalDateTime.parse("2025-04-01T08:00"),
                    endTime = LocalDateTime.parse("2025-04-01T09:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Bauphysik 2",
                    lecturer = "Prof. Dr. Ing. Isabell Nemeth, Prof.Dr. Ulrich Schanda",
                    relevantDegrees = "IAB-B2",
                    startTime = LocalDateTime.parse("2025-04-01T09:45"),
                    endTime = LocalDateTime.parse("2025-04-01T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "International Strategic Management",
                    lecturer = "Prof.Dr. Eckhard Lachmann",
                    relevantDegrees = "INM-M2",
                    startTime = LocalDateTime.parse("2025-04-01T11:45"),
                    endTime = LocalDateTime.parse("2025-04-01T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Logistics Processes in SAP",
                    lecturer = "Prof.Dr. Bernhard Holaubek",
                    relevantDegrees = "INM-M2",
                    startTime = LocalDateTime.parse("2025-04-01T17:15"),
                    endTime = LocalDateTime.parse("2025-04-01T20:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Grundlagen der Bauphysik 2",
                    lecturer = "Prof.Dr. Gerhard Friedsam, Prof.Dr. Andreas Rabold",
                    relevantDegrees = "HA-B2",
                    startTime = LocalDateTime.parse("2025-04-02T08:00"),
                    endTime = LocalDateTime.parse("2025-04-02T09:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Grundlagen der Bauphysik 2",
                    lecturer = "Prof.Dr. Gerhard Friedsam, Prof.Dr. Andreas Rabold",
                    relevantDegrees = "BI-B2",
                    startTime = LocalDateTime.parse("2025-04-02T09:45"),
                    endTime = LocalDateTime.parse("2025-04-02T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Strategische Unternehmensführung und Projektmanagement",
                    lecturer = "Prof.Dr.rer.pol Carolin Fleischmann",
                    relevantDegrees = "BW-B6",
                    startTime = LocalDateTime.parse("2025-04-02T11:45"),
                    endTime = LocalDateTime.parse("2025-04-02T13:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Strategische Unternehmensführung und Projektmanagement",
                    lecturer = "Julia Drexler",
                    relevantDegrees = "BW-B6",
                    startTime = LocalDateTime.parse("2025-04-02T13:45"),
                    endTime = LocalDateTime.parse("2025-04-02T15:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Verteilte Verarbeitung, Verteilte Verarbeitung",
                    lecturer = "Prof.Dr. Gerd Beneken",
                    relevantDegrees = "INF-B4, WIF-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-03T08:00"),
                    endTime = LocalDateTime.parse("2025-04-03T09:30"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Bauphysik 2",
                    lecturer = "Prof. Dr. Ing. Isabell Nemeth, Prof.Dr. Ulrich Schanda",
                    relevantDegrees = "IAB-B2",
                    startTime = LocalDateTime.parse("2025-04-03T09:45"),
                    endTime = LocalDateTime.parse("2025-04-03T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Bauphysik 2, Bauphysik 2 Vorlesung",
                    lecturer = "Dr. Andreas Mayr, Prof. Dr. Ing. Isabell Nemeth",
                    relevantDegrees = "ARC-B4, INN-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-04T09:45"),
                    endTime = LocalDateTime.parse("2025-04-04T11:15"),
                ),
                RoomSchedule(
                    location = StarPlanLocation.RO,
                    room = "A1.03",
                    name = "Bauphysik 2, Bauphysik 2 Vorlesung",
                    lecturer = "Dr. Andreas Mayr, Prof. Dr. Ing. Isabell Nemeth",
                    relevantDegrees = "ARC-B4, INN-B/FWPM",
                    startTime = LocalDateTime.parse("2025-04-04T11:45"),
                    endTime = LocalDateTime.parse("2025-04-04T13:15"),
                ),
            )
        val `s-138Rooms` =
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
            )
    }

    @Test
    fun `test getScheduleForRoom with non-parallel calendar entries`() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A1.03", date = LocalDate.now())
            assertThat(rooms.schedule).hasSize(16)
            assertThat(rooms.schedule).containsExactlyInAnyOrderElementsOf(a103Rooms)
        }

    @Test
    fun `test getScheduleForRoom with parallel calendar entries`() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.01b", date = LocalDate.now())
            assertThat(rooms.schedule).hasSize(12)
            assertThat(rooms.schedule).containsExactlyInAnyOrderElementsOf(a001bRooms)
        }

    @Test
    fun `test getScheduleForRoom with 'Vorlesungsfrei' entries`() =
        runTest {
            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "S-1.38", date = LocalDate.now())
            assertThat(rooms.schedule).hasSize(1)
            assertThat(rooms.schedule).containsExactlyInAnyOrderElementsOf(`s-138Rooms`)
        }

    @Test
    fun `test getAvailableRooms for RO Location`() =
        runTest {
            val rooms = starPlanService.getAvailableRooms(StarPlanLocation.RO)
            assertThat(rooms).hasSize(228)
        }

    @Test
    fun `test getScheduleForRoom cache functionality`() =
        runTest {
            val cacheKey = "3_A0.01b_${LocalDate.now().get(WeekFields.ISO.weekOfYear())}"

            val rooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.01b", date = LocalDate.now())
            assertThat(rooms.schedule).hasSize(12)
            assertThat(rooms.schedule).containsExactlyInAnyOrderElementsOf(a001bRooms)

            verify(exactly = 1) { cache.get(cacheKey, SPlanScheduleList::class.java) }
            verify(exactly = 1) { cache.put(cacheKey, rooms) }

            every { cache.get(cacheKey, SPlanScheduleList::class.java) } returns rooms

            val cacheRooms = starPlanService.getScheduleForRoom(StarPlanLocation.RO, "A0.01b", date = LocalDate.now())
            assertThat(cacheRooms.schedule).hasSize(12)
            assertThat(cacheRooms.schedule).containsExactlyInAnyOrderElementsOf(a001bRooms)

            verify(exactly = 2) { cache.get(cacheKey, SPlanScheduleList::class.java) }
            verify(exactly = 1) { cache.put(cacheKey, rooms) }
        }

    @Test
    fun `test clearCache functionality`() =
        runTest {
            starPlanService.clearCache()
            verify(exactly = 1) { cache.clear() }
        }
}
