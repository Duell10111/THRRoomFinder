package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.repository.RoomRepository
import org.springframework.stereotype.Service

@Service
class AdminService(
    private val roomRepository: RoomRepository,
) {
    suspend fun deleteRoomFromDatabase(roomName: String) {
        roomRepository.deleteRoomByName(roomName)
    }

    suspend fun deleteAllRoomsFromDatabase() {
        roomRepository.deleteAll()
    }
}
