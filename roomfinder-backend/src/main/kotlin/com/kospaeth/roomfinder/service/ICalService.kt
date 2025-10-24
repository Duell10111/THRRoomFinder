package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.dto.RoomDTO
import io.github.oshai.kotlinlogging.KotlinLogging
import net.fortuna.ical4j.data.CalendarBuilder
import net.fortuna.ical4j.data.CalendarOutputter
import net.fortuna.ical4j.model.PropertyList
import net.fortuna.ical4j.model.component.VEvent
import net.fortuna.ical4j.model.property.Geo
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.io.StringReader

private val logger = KotlinLogging.logger {}

@Service
class ICalService(
    private val roomService: RoomService,
) {
    val calendarBuilder = CalendarBuilder()

    suspend fun enhanceICalWithLocations(icalUrl: String): String {
        return StringReader(icalUrl).use { reader ->
            calendarBuilder.build(reader).let { calendar ->
                val events =
                    calendar.componentList.all.mapNotNull { component ->
                        if (component is VEvent) {
                            val iCalLocation = component.location.value

                            roomService.getLocationForRoom(iCalLocation)?.let {
                                component.propertyList = component.propertyList.add(it.iCalGeoProperty) as PropertyList
                            } ?: logger.warn { "No location found for room: $iCalLocation" }
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

val RoomDTO.iCalGeoProperty: Geo
    get() = Geo("${this.location.lat};${this.location.lng}")
