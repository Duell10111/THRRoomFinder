package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.config.SPlanProperties
import com.kospaeth.roomfinder.data.dto.RoomDTO
import io.github.oshai.kotlinlogging.KotlinLogging
import net.fortuna.ical4j.data.CalendarBuilder
import net.fortuna.ical4j.data.CalendarOutputter
import net.fortuna.ical4j.model.PropertyList
import net.fortuna.ical4j.model.component.VEvent
import net.fortuna.ical4j.model.property.Geo
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import java.io.ByteArrayOutputStream
import java.io.StringReader

private val logger = KotlinLogging.logger {}

@Service
class ICalService(
    private val sPlanProperties: SPlanProperties,
    private val roomService: RoomService,
    private val webClient: WebClient,
) {
    @Cacheable("iCalCalendar", key = "#icalUrl")
    suspend fun enhanceICalURLWithLocations(icalUrl: String): String {
        if (sPlanProperties.trustedIcalPrefixes.none { icalUrl.startsWith(it) }) {
            error("iCal URL must be trusted - URL used: $icalUrl")
        }
        logger.info { "Fetching iCal URL: $icalUrl" }
        webClient.get().uri(icalUrl).retrieve().awaitBody<String>().let { icalValue ->
            return enhanceICalWithLocations(icalValue)
        }
    }

    suspend fun enhanceICalWithLocations(icalValue: String): String {
        val roomLocationCache = mutableMapOf<String, RoomDTO?>()

        return StringReader(icalValue).use { reader ->
            CalendarBuilder().build(reader).let { calendar ->
                val events =
                    calendar.componentList.all.mapNotNull { component ->
                        if (component is VEvent) {
                            val iCalLocation = component.location.value
                            val room =
                                roomLocationCache.getOrLoad(iCalLocation) {
                                    roomService.getLocationForRoom(iCalLocation) ?: run {
                                        logger.warn { "No location found for room $iCalLocation" }
                                        null
                                    }
                                }

                            room?.let {
                                component.propertyList = component.propertyList.add(it.iCalGeoProperty) as PropertyList
                            }
                            component
                        } else {
                            null
                        }
                    }
                events.forEach { calendar.componentList.add(it) }
                val out = ByteArrayOutputStream()
                val outputter = CalendarOutputter()
                outputter.output(calendar, out)
                out.toString(Charsets.UTF_8)
            }
        }
    }
}

private suspend fun <K, V> MutableMap<K, V?>.getOrLoad(
    key: K,
    loader: suspend () -> V?,
): V? {
    if (containsKey(key)) {
        return this[key]
    }

    return loader().also { this[key] = it }
}

val RoomDTO.iCalGeoProperty: Geo
    get() = Geo("${this.location.lat};${this.location.lng}")
