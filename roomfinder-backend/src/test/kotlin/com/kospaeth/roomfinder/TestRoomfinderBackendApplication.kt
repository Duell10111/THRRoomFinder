package com.kospaeth.roomfinder

import org.springframework.boot.fromApplication
import org.springframework.boot.with

fun main(args: Array<String>) {
    fromApplication<RoomfinderBackendApplication>().with(TestcontainersConfiguration::class).run(*args)
}
