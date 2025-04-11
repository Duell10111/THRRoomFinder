package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.repository.RoomRepository
import com.kospaeth.roomfinder.service.osm.OSMExtractorService
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.Test

class RoomServiceTest {
    @MockK(relaxed = true)
    lateinit var osmExtractorService: OSMExtractorService

    @MockK(relaxed = true)
    lateinit var roomRepository: RoomRepository

    @InjectMockKs lateinit var roomService: RoomService

    @Test
    fun getRoom() {
        // TODO: Add Wiremock
    }
}
