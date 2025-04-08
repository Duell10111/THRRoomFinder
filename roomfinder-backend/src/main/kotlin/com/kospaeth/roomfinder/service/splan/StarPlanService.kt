package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.kospaeth.roomfinder.config.SPlanProperties
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
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
import java.time.LocalTime

private val logger = KotlinLogging.logger {}

@Service
class StarPlanService(
    private val webClient: WebClient,
    private val properties: SPlanProperties,
    private val objectMapper: ObjectMapper,
    cacheManager: CacheManager
) {

    private val cache: Cache = cacheManager.getCache("splan") ?: throw IllegalStateException("Cache not initialized")

    // TODO: Add fkt to parse iCal fkts and enhance with room latlongs

    // TODO: Extend for future location selection
    suspend fun getScheduleForRoom(location: StarPlanLocation, room: String): List<RoomSchedule> {
        return getRoom(location, room)?.id.let { roomId ->
            val splanURL = "https://splan.th-rosenheim.de/splan/json?m=getTT&sel=ro&pu=41&ro=${roomId}&sd=true&dfc=${LocalDate.now()}&loc=${location.locationId}&sa=false&cb=o"

            logger.info { "Fetching SPlan Schedule via url $splanURL" }

            webClient.get()
                .uri(splanURL)
                .awaitExchange { response ->
                    val roomData = response.awaitBody<String>()

                    parseRoomData(roomData, location)
                }
        }
    }

    private fun parseRoomData(roomData: String, location: StarPlanLocation): List<RoomSchedule> {
        val parsedData = Jsoup.parse(roomData)

        val weekDayEntries = parsedData.getElementsByClass("ttweekdaycell")
        val days = weekDayEntries.map { weekDay ->
            weekDay.getElementsByAttribute("data-date").attr("data-date").let { LocalDate.parse(it) }
        }

        val boxWidth = weekDayEntries.find {
            it.hasAttr("style")
        }?.styleWidth ?: throw IllegalStateException("Can't parse room width of SPLAN calendar")

        val timeEvents = parsedData.getElementsByClass("ttevent").mapNotNull { timeEvent ->
            val day = timeEvent.getCalendarIndex(boxWidth)?.let { days[it] }
                ?: return@mapNotNull null // TODO: Add error log entry here

            // Use Tooltip information as they are contain no shortcuts
            timeEvent.getElementsByClass("tooltip").textNodes().let { textNodes ->
                runCatching {
                    val (start, end) = textNodes.last().wholeText.split("-").map { LocalTime.parse(it) }.map { day.atTime(it) }
                    RoomSchedule(
                        location = location,
                        name = textNodes.gett(0).wholeText,
                        lecturer = textNodes.subList(1, textNodes.size - 3).map { it.wholeText }.joinToString(", "),
                        relevantDegrees = textNodes.gett(-3).wholeText,
                        room = textNodes.gett(-2).wholeText,
                        startTime = start,
                        endTime = end
                    )
                }.onFailure {
                    logger.error(it) { "Error while parsing room data: $timeEvent" }
                }.getOrNull()
            }
        }

        return timeEvents
    }

    private fun Element.getCalendarIndex(timeBoxWidth: Int) : Int? {
        return styleLeft?.let {
            // Use min 0 as left style is sometime -1px which results in a negative div
            Math.floorDiv(it, timeBoxWidth).coerceAtLeast(0)
        }
    }

    private val WIDTH_EXTRACT_REGEX = """width:(\d+)px;""".toRegex()
    private val LEFT_EXTRACT_REGEX = """left:(-?\d+)px;""".toRegex()

    private val Element.styleWidth : Int?
        get() = attr("style").let { WIDTH_EXTRACT_REGEX.find(it)?.groupValues?.get(1)?.toInt() }

    private val Element.styleLeft : Int?
        get() = attr("style").let { LEFT_EXTRACT_REGEX.find(it)?.groupValues?.get(1)?.toInt() }

    /**
     * Helper fkt to allow accessing a list from the end with negative indexes
     */
    private fun <E> List<E>.gett(index: Int): E = if (index < 0) {
        this[size + index]
    } else {
        this[index]
    }

    // TODO: Cache?!
    suspend fun getRoom(location: StarPlanLocation, room: String): SPlanRoomResponseItem? {
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
                val value : List<List<SPlanRoomResponseItem>> = objectMapper.readValue(str)

                value.firstOrNull() ?: emptyList()
            }.also { list ->
                if(list.isNotEmpty()) {
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

    private suspend fun saveAvailableRooms(location: StarPlanLocation, rooms: List<SPlanRoomResponseItem>) {
        mono { cache[location.avalRoomCacheKey] = AvailableRoomsCacheEntry(rooms) }.awaitSingleOrNull()
    }

    private val StarPlanLocation.avalRoomCacheKey: String
        get() = "splan-room-list_${locationId}"
}

data class AvailableRoomsCacheEntry(
    val rooms: List<SPlanRoomResponseItem>,
)

enum class StarPlanLocation(val locationId: Int) {
    RO(3)
}
