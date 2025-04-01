package com.kospaeth.roomfinder

import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName

@ActiveProfiles("test")
@Testcontainers
abstract class DatabaseTestBase {
    companion object {
        @Container
        val postgres =
            PostgreSQLContainer(
                DockerImageName.parse("postgis/postgis:17-3.5-alpine").asCompatibleSubstituteFor("postgres"),
            ).apply {
                withDatabaseName("testDB").withUsername("postgres").withPassword("123456")
            }

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.r2dbc.url", Companion::r2dbcUrl)
            registry.add("spring.r2dbc.username", postgres::getUsername)
            registry.add("spring.r2dbc.password", postgres::getPassword)
        }

        fun r2dbcUrl(): String {
            return "r2dbc:postgresql://${postgres.host}:${postgres.getMappedPort(
                PostgreSQLContainer.POSTGRESQL_PORT,
            )}/${postgres.databaseName}"
        }
    }
}
