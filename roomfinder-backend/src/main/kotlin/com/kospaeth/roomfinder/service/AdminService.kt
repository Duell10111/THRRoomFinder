package com.kospaeth.roomfinder.service

import com.kospaeth.roomfinder.data.repository.RoomRepository
import com.kospaeth.roomfinder.service.splan.StarPlanService
import org.springframework.cache.annotation.CacheEvict
import org.springframework.stereotype.Service

/**
 * Service class for performing administrative tasks related to rooms and schedules.
 *
 * Responsible for removing rooms from the database and clearing relevant caches.
 */
@Service
class AdminService(
    private val roomRepository: RoomRepository,
    private val starPlanService: StarPlanService,
) {
    /**
     * Deletes all rooms with the given name from the database.
     *
     * This method also clears the relevant room caches.
     *
     * @param roomName The name of the room to be deleted.
     */
    @CacheEvict(cacheNames = ["rooms", "roomsExtended"], allEntries = true)
    suspend fun deleteRoomFromDatabase(roomName: String) {
        roomRepository.deleteRoomsByNameEquals(roomName)
    }

    /**
     * Deletes all rooms from the database.
     *
     * This method also clears the relevant room caches.
     */
    @CacheEvict(cacheNames = ["rooms", "roomsExtended"], allEntries = true)
    suspend fun deleteAllRoomsFromDatabase() {
        roomRepository.deleteAll()
    }

    /**
     * Clears the schedule data cache.
     *
     * Uses the [StarPlanService] to invalidate cached schedule data.
     */
    suspend fun clearCachedSchedules() {
        starPlanService.clearCache()
    }
}
