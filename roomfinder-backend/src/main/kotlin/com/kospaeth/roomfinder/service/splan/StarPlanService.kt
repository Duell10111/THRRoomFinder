package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.kospaeth.roomfinder.config.SPlanProperties
import com.kospaeth.roomfinder.utils.getAllKeysPresent
import com.kospaeth.roomfinder.utils.getEntry
import com.kospaeth.roomfinder.utils.putEntry
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.withContext
import org.jsoup.Jsoup
import org.jsoup.nodes.Element
import org.springframework.cache.Cache
import org.springframework.cache.CacheManager
import org.springframework.cache.set
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.reactive.function.client.awaitExchange
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.temporal.WeekFields

private val logger = KotlinLogging.logger {}

// Parser Attributes
private const val ATTRIBUTE_DATA_DATE = "data-date"

@Service
class StarPlanService(
    private val webClient: WebClient,
    private val properties: SPlanProperties,
    private val objectMapper: ObjectMapper,
    cacheManager: CacheManager,
) {
    private val cache: Cache = cacheManager.getCache("splan") ?: throw IllegalStateException("Cache not initialized")

    // TODO: Add fkt to parse iCal fkts and enhance with room latlongs

    suspend fun clearCache() =
        withContext(Dispatchers.IO) {
            cache.clear()
        }

    suspend fun getCachedSchedulesForCurrentWeek(location: StarPlanLocation): Map<String, SPlanScheduleList> {
        val rooms = getAvailableRooms(location)
        val keyMap =
            rooms.associate {
                getScheduleCacheKey(location, it.shortName, LocalDate.now()) to it.shortName
            }
        return cache.getAllKeysPresent<SPlanScheduleList>(keyMap.keys)
            // Map Cache key to the original room name back
            .mapKeys { (key, _) -> keyMap.getOrDefault(key, "") }
            .filterKeys { it !== "" }
    }

    suspend fun getScheduleForRoom(
        location: StarPlanLocation,
        room: String,
        date: LocalDate,
    ): SPlanScheduleList {
        val cacheKey = getScheduleCacheKey(location, room, date)
        // Return cache if available
        cache.getEntry<SPlanScheduleList>(cacheKey)?.let {
            logger.debug { "Found cached schedule for room $room and date $date" }
            return it
        }

        logger.debug { "No cached schedule found for room $room and date $date, fetching from SPlan" }
        @Suppress("ktlint:standard:max-line-length")
        return getRoom(location, room)?.id.let { roomId ->
            val splanURL = "${properties.url}?m=getTT&sel=ro&pu=41&ro=$roomId&sd=true&dfc=$date&loc=${location.locationId}&sa=false&cb=o"
            logger.debug { "Fetching SPlan Schedule via url $splanURL" }

            webClient.get()
                .uri(splanURL)
                .awaitExchange { response ->
                    val roomData = response.awaitBody<String>()

                    parseRoomData(roomData, location)
                }.also {
                    cache.putEntry(cacheKey, it)
                }
        }
    }

    private fun parseRoomData(
        roomData: String,
        location: StarPlanLocation,
    ): SPlanScheduleList {
        val parsedData = Jsoup.parse(roomData)

        val weekDayEntries = parsedData.getElementsByClass("ttweekdaycell")
        val days =
            weekDayEntries.map { weekDay ->
                weekDay.getElementsByAttribute(ATTRIBUTE_DATA_DATE).attr(ATTRIBUTE_DATA_DATE).let { LocalDate.parse(it) }
            }

        val boxWidths =
            weekDayEntries.map {
                it.styleLeft ?: throw IllegalStateException("Can't parse room width of SPLAN calendar")
            }

        val timeEvents =
            parsedData.getElementsByClass("ttevent").mapNotNull { timeEvent ->
                val day =
                    timeEvent.getCalendarIndex(boxWidths)?.let { days[it] }
                        ?: return@mapNotNull null // TODO: Add error log entry here

                // Check if timeEvent is an holiday event
                if (timeEvent.hasClass("holidayg")) {
                    // Use Tooltip information as they contain no shortcuts in names
                    timeEvent.getElementsByClass("tooltip").textNodes().let { textNodes ->
                        runCatching {
                            RoomSchedule(
                                location = location,
                                name = textNodes[0].wholeText,
                                room = "",
                                lecturer = textNodes[1].wholeText,
                                startTime = day.atTime(8, 0),
                                endTime = day.atTime(20, 0),
                            )
                        }.onFailure {
                            logger.error(it) { "Error while parsing holiday room data: $timeEvent" }
                        }.getOrNull()
                    }
                } else {
                    // Use Tooltip information as they contain no shortcuts in names
                    timeEvent.getElementsByClass("tooltip").textNodes().let { textNodes ->
                        runCatching {
                            val (start, end) = textNodes.last().wholeText.split("-").map { LocalTime.parse(it) }.map { day.atTime(it) }
                            RoomSchedule(
                                location = location,
                                name = textNodes.gett(0).wholeText,
                                lecturer = textNodes.subList(1, textNodes.size - 3).joinToString(", ") { it.wholeText },
                                relevantDegrees = textNodes.gett(-3).wholeText,
                                room = textNodes.gett(-2).wholeText,
                                startTime = start,
                                endTime = end,
                            )
                        }.onFailure {
                            logger.error(it) { "Error while parsing room data: $timeEvent" }
                        }.getOrNull()
                    }
                }
            }

        val lastUpdate =
            parsedData.getElementsByClass("lastupdate").takeIf { it.size >= 3 }?.let { updateClasses ->
                val date =
                    updateClasses[1].let { dateElement ->
                        runCatching {
                            val dateText =
                                if (dateElement.hasAttr(
                                        ATTRIBUTE_DATA_DATE,
                                    )
                                ) {
                                    dateElement.attr(ATTRIBUTE_DATA_DATE)
                                } else {
                                    dateElement.wholeText()
                                }
                            LocalDate.parse(dateText)
                        }.onFailure {
                            logger.error(it) { "Error while parsing last update date: $it" }
                        }.getOrNull()
                    } ?: LocalDate.now()
                val time =
                    updateClasses[2].wholeText().let { timeText ->
                        runCatching {
                            LocalTime.parse(timeText)
                        }.onFailure {
                            logger.error(it) { "Error while parsing last update time: $it" }
                        }.getOrNull()
                    } ?: LocalTime.now()
                // Combine date and time to LocalDateTime
                date.atTime(time)
            } ?: LocalDateTime.now()

        return SPlanScheduleList(timeEvents, lastUpdate)
    }

    private fun Element.getCalendarIndex(timeBoxWidths: List<Int>): Int? {
        // Increase by one to be in style box
        return styleLeft?.inc()?.let { position ->
            (timeBoxWidths.indexOfFirst { it > position }.takeIf { it != -1 } ?: timeBoxWidths.size)
                .dec() // Decrease by one to get the start index
        }?.coerceIn(0, timeBoxWidths.size - 1)
    }

    private val widthExtractRegex = """width:(\d+)px;""".toRegex()
    private val leftExtractRegex = """left:(-?\d+)px;""".toRegex()

    private val Element.styleWidth: Int?
        get() = attr("style").let { widthExtractRegex.find(it)?.groupValues?.get(1)?.toInt() }

    private val Element.styleLeft: Int?
        get() = attr("style").let { leftExtractRegex.find(it)?.groupValues?.get(1)?.toInt() }

    /**
     * Helper fkt to allow accessing a list from the end with negative indexes
     */
    private fun <E> List<E>.gett(index: Int): E =
        if (index < 0) {
            this[size + index]
        } else {
            this[index]
        }

    suspend fun getRoom(
        location: StarPlanLocation,
        room: String,
    ): SPlanRoomResponseItem? {
        return getAvailableRooms(location).firstOrNull { it.shortName == room }
    }

    suspend fun getAvailableRooms(location: StarPlanLocation): List<SPlanRoomResponseItem> {
        getAvailableRoomsFromCache(location)?.let {
            logger.debug { "Found available rooms for location $location from cache: ${it.size}" }
            return it
        }

        return webClient.get()
            .uri("${properties.url}?m=getros&loc=${location.locationId}")
            .headers { headers ->
                headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            }
            .awaitExchange { response ->
                // Parse byteArray manually as sever return unsupported ISO_8859_1 Charset
                val str = response.awaitBody<ByteArrayResource>().byteArray.toString(Charsets.ISO_8859_1)
                // Nested list
                val value: List<List<SPlanRoomResponseItem>> = objectMapper.readValue(str)

                value.firstOrNull() ?: emptyList()
            }.also { list ->
                if (list.isNotEmpty()) {
                    saveAvailableRooms(location, list)
                    logger.debug { "Caching SPlan Room list for location $location" }
                }
            }
    }

    private suspend fun getAvailableRoomsFromCache(location: StarPlanLocation): List<SPlanRoomResponseItem>? {
        return mono {
            cache.get(location.avalRoomCacheKey, AvailableRoomsCacheEntry::class.java)?.rooms
        }.awaitSingleOrNull()
    }

    private suspend fun saveAvailableRooms(
        location: StarPlanLocation,
        rooms: List<SPlanRoomResponseItem>,
    ) {
        mono { cache[location.avalRoomCacheKey] = AvailableRoomsCacheEntry(rooms) }.awaitSingleOrNull()
    }

    private val StarPlanLocation.avalRoomCacheKey: String
        get() = "splan-room-list_$locationId"

    private fun getScheduleCacheKey(
        location: StarPlanLocation,
        room: String,
        date: LocalDate,
    ): String {
        val cacheKey = "${location.locationId}_${room}_${date.get(WeekFields.ISO.weekOfYear())}"
        return cacheKey
    }
}

data class AvailableRoomsCacheEntry(
    val rooms: List<SPlanRoomResponseItem>,
)

data class SPlanScheduleList(
    val schedule: List<RoomSchedule>,
    val updatedAt: LocalDateTime,
)

enum class StarPlanLocation(val locationId: Int) {
    RO(3),
}
