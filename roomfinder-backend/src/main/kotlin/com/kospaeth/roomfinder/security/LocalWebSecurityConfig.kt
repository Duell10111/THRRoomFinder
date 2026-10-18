package com.kospaeth.roomfinder.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.config.web.server.invoke
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource

@Profile("no-auth")
@Configuration
class LocalWebSecurityConfig(
    @Value("\${room-finder.cors.allowed-origins:http://localhost:3000,http://localhost}")
    private val allowedOrigins: List<String>,
) {
    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain =
        http {
            authorizeExchange {
                authorize(anyExchange, permitAll)
            }
            csrf { disable() }
            formLogin { disable() }
            httpBasic { disable() }
            anonymous { disable() }
        }

    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        // Allow cors for local frontend app
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = allowedOrigins
        configuration.allowedMethods = listOf("GET", "POST", "OPTIONS", "PUT", "DELETE")
        configuration.allowedHeaders = listOf("*")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
