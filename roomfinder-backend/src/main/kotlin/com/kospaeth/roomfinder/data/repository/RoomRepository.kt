package com.kospaeth.roomfinder.data.repository

import com.kospaeth.roomfinder.data.entities.Room
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.util.UUID

interface RoomRepository : CoroutineCrudRepository<Room, UUID> {
    suspend fun findRoomByName(name: String): Room?
}
