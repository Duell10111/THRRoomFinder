package com.kospaeth.roomfinder.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.config.web.server.invoke
import org.springframework.security.web.server.SecurityWebFilterChain

@Profile("no-auth || test")
@Configuration
class LocalWebSecurityConfig {
    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain? {
        return http {
            authorizeExchange {
                authorize(anyExchange, permitAll)
            }
            csrf { disable() }
            formLogin { disable() }
            httpBasic { disable() }
            cors { disable() }
            anonymous { disable() }
        }
    }
}
