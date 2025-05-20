package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.repository.RoomRepository
import com.kospaeth.roomfinder.service.splan.StarPlanService
import org.springframework.cache.annotation.CacheEvict
import org.springframework.stereotype.Service

@Service
class AdminService(
    private val roomRepository: RoomRepository,
    private val starPlanService: StarPlanService,
) {
    @CacheEvict(cacheNames = ["rooms", "roomsExtended"], allEntries = true)
    suspend fun deleteRoomFromDatabase(roomName: String) {
        roomRepository.deleteRoomsByNameEquals(roomName)
    }

    @CacheEvict(cacheNames = ["rooms", "roomsExtended"], allEntries = true)
    suspend fun deleteAllRoomsFromDatabase() {
        roomRepository.deleteAll()
    }

    suspend fun clearCachedSchedules() {
        starPlanService.clearCache()
    }
}
