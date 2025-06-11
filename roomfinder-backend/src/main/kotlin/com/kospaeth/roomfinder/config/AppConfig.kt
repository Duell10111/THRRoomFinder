package com.kospaeth.roomfinder.config

import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
@EnableCaching
@ConfigurationPropertiesScan
class AppConfig {
    @Bean
    fun webClient(): WebClient {
        return WebClient
            .builder()
            .build()
    }
}
