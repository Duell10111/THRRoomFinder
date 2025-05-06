package com.kospaeth.roomfinder.service.osm

import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import com.github.tomakehurst.wiremock.junit5.WireMockExtension
import com.github.tomakehurst.wiremock.junit5.WireMockTest
import com.kospaeth.roomfinder.config.OSMProperties
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.RegisterExtension
import org.springframework.core.codec.DecodingException
import org.springframework.web.reactive.function.client.WebClient

@WireMockTest
class OSMExtractorServiceTest {
    private lateinit var osmExtractorService: OSMExtractorService

    @RegisterExtension
    val wireMockExtension: WireMockExtension =
        WireMockExtension.newInstance().options(wireMockConfig().dynamicPort()).build()

    @BeforeEach
    fun setUp() {
//        val httpClient = HttpClient
//            .create()
//            .wiretap(
//                "reactor.netty.http.client.HttpClient",
//                LogLevel.INFO, AdvancedByteBufFormat.TEXTUAL
//            )
//        val webClient = WebClient.builder().clientConnector(ReactorClientHttpConnector(httpClient)).build()
        val properties = OSMProperties("${wireMockExtension.baseUrl()}/api/interpreter")
        osmExtractorService = OSMExtractorService(WebClient.create(), properties)
    }

    @Test
    fun `test getIndoorRoomsForBuilding return proper elements`() =
        runTest {
            val data = osmExtractorService.getIndoorRoomsForBuilding("28400949", "A0.08")
            assertNotNull(data)
            assertThat(data!!.elements).hasSize(6)
        }

    @Test
    fun `test getIndoorRoomsForBuilding throws error on request failure`() =
        runTest {
            assertThrows<DecodingException> {
                osmExtractorService.getIndoorRoomsForBuilding("28400949", "A0.10")
            }
        }
}
