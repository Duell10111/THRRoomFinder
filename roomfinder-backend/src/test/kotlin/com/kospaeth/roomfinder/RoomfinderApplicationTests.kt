package com.kospaeth.roomfinder

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Profile

@Import(TestcontainersConfiguration::class)
@Profile("no-auth")
@SpringBootTest
class RoomfinderApplicationTests : DatabaseTestBase() {
    @Test
    fun contextLoads() {
    }
}
