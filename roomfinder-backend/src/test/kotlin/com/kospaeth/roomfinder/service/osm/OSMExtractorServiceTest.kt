package com.kospaeth.roomfinder.service.osm

import com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import com.github.tomakehurst.wiremock.junit5.WireMockExtension
import com.github.tomakehurst.wiremock.junit5.WireMockTest
import com.kospaeth.roomfinder.config.OSMProperties
import io.netty.handler.logging.LogLevel
import kotlinx.coroutines.delay
import kotlinx.coroutines.test.runTest
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.RegisterExtension
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import reactor.netty.transport.logging.AdvancedByteBufFormat

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
}
