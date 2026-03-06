package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.base64Encode
import com.kospaeth.roomfinder.service.ICalService
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class CalendarControllerTest {
    @MockK(relaxed = true)
    private lateinit var iCalService: ICalService

    @InjectMockKs
    private lateinit var calendarController: CalendarController

    @Test
    fun `test enhanceICal works correctly`() =
        runTest {
            calendarController.enhanceICal("ical-url".base64Encode())

            coVerify { iCalService.enhanceICalURLWithLocations("ical-url") }
        }

    @Test
    fun `test enhanceICal passes exceptions`() =
        runTest {
            coEvery { iCalService.enhanceICalURLWithLocations(any()) } throws RuntimeException()
            assertThrows<RuntimeException> { calendarController.enhanceICal("ical-url".base64Encode()) }
        }
}
