package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.loadClassFileContent
import io.mockk.coEvery
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class ICalServiceTest {
    @MockK(relaxed = true)
    private lateinit var roomService: RoomService

    @InjectMockKs
    private lateinit var iCalService: ICalService

    @Test
    fun parseICal() =
        runTest {
            coEvery { roomService.getLocationForRoom(any()) } returns
                RoomDTO(
                    name = "A0.10",
                    location = LocationDTO(lat = 10.0, lng = 20.0),
                )

            val iCal = loadClassFileContent("splan_config.ics")
            val rtn = iCalService.enhanceICalWithLocations(iCal)
            assertThat(rtn).containsSequence("GEO:10.0;20.0")
        }

    @Test
    fun testGeoCreation() {
        RoomDTO("A0.10", LocationDTO(lat = 10.0, lng = 20.0)).iCalGeoProperty
    }
}
