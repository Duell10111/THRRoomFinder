package com.kospaeth.roomfinder.config

import io.netty.handler.logging.LogLevel
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import reactor.netty.transport.logging.AdvancedByteBufFormat

@Configuration
@EnableCaching
@ConfigurationPropertiesScan
class AppConfig {
    @Bean
    fun webClient(): WebClient {
        val httpClient =
            HttpClient
                .create()
                .wiretap(
                    "reactor.netty.http.client.HttpClient",
                    LogLevel.INFO,
                    AdvancedByteBufFormat.TEXTUAL,
                )

        return WebClient
            .builder()
//            .clientConnector(ReactorClientHttpConnector(httpClient))
            .build()
    }
}
