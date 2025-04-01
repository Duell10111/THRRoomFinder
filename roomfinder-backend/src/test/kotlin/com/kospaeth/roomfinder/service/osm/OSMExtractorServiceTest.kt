package com.kospaeth.roomfinder.service.osm

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.web.reactive.function.client.WebClient

class OSMExtractorServiceTest {
    private val osmExtractorService = OSMExtractorService(WebClient.create())

    @Test
    fun getIndoorRoomsForBuilding() =
        runTest {
            val data = osmExtractorService.getIndoorRoomsForBuilding("28400949", "A0.08")
            assertNotNull(data)
        }
}
