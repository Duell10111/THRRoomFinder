package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.entities.Building
import com.kospaeth.roomfinder.data.repository.BuildingRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.junit.jupiter.params.provider.ValueSource
import kotlin.test.assertNull

@ExtendWith(MockKExtension::class)
class BuildingServiceTest {
    @MockK(relaxed = true)
    private lateinit var buildingRepository: BuildingRepository

    @InjectMockKs private lateinit var buildingService: BuildingService

    @Test
    fun `getBuildingForRoom should return building if found in the database`() =
        runTest {
            coEvery { buildingRepository.findBuildingByName(eq("A")) } returns Building(name = "A")

            assertThat(buildingService.getBuildingForRoom("A0.10", "A"))
                .isEqualTo(Building(name = "A"))
        }

    @ParameterizedTest
    @CsvSource("A0.10, A", "A0.01a, A", "A0.01c, A", "B0.10, B")
    fun `getBuildingForRoom should return building if found in the database without provided buildingName param`(
        room: String,
        buildingName: String,
    ) = runTest {
        coEvery { buildingRepository.findBuildingByName(eq(buildingName)) } returns Building(name = buildingName)

        assertThat(buildingService.getBuildingForRoom(room))
            .isEqualTo(Building(name = buildingName))

        coVerify(exactly = 0) { buildingRepository.save(any()) }
    }

    @ParameterizedTest
    @CsvSource("A0.10, A", "A0.01a, A", "A0.01c, A", "B0.10, B")
    fun `getBuildingForRoom should return and save building if not found in the database without provided buildingName param`(
        room: String,
        buildingName: String,
    ) = runTest {
        coEvery { buildingRepository.findBuildingByName(eq(buildingName)) } returns null
        coEvery { buildingRepository.save(any()) } returnsArgument (0)

        assertThat(buildingService.getBuildingForRoom(room))
            .isEqualTo(Building(name = buildingName))

        coVerify(exactly = 1) { buildingRepository.save(any()) }
    }

    @ParameterizedTest
    @ValueSource(strings = ["$$$"])
    fun `getBuildingForRoom should return null without provided buildingName param and failed extraction of building name from room`(
        room: String,
    ) = runTest {
        coEvery { buildingRepository.findBuildingByName(any()) } returns null
        coEvery { buildingRepository.save(any()) } returnsArgument (0)

        assertNull(buildingService.getBuildingForRoom(room))

        coVerify(exactly = 0) { buildingRepository.save(any()) }
    }
}
