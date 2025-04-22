package com.kospaeth.roomfinder.security

import com.kospaeth.roomfinder.controller.ControllerStruct
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.config.web.server.invoke
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource

@Profile("!no-auth")
@Configuration
class WebSecurityConfig {
    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain? {
        return http {
            authorizeExchange {
                authorize("/actuator/health", permitAll)
                authorize("${ControllerStruct.ROOM_CONTROLLER}/**", permitAll)
                authorize(anyExchange, authenticated)
            }
            csrf { disable() }
            formLogin { disable() }
            httpBasic { disable() }
            anonymous { disable() }
        }
    }

    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        // Allow cors for local frontend app
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("https://thrroomfinder.duell10111.de")
        configuration.allowedMethods = listOf("GET", "POST", "OPTIONS", "PUT", "DELETE")
        configuration.allowedHeaders = listOf("*")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
