package com.kospaeth.roomfinder.data.repository

import com.kospaeth.roomfinder.data.entities.Room
import com.kospaeth.roomfinder.data.entities.RoomWithBuildingData
import kotlinx.coroutines.flow.Flow
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.util.UUID

/**
 * Repository interface for managing [Room] entities.
 *
 * Provides coroutine support for CRUD operations and custom queries related to rooms and their buildings.
 */
interface RoomRepository : CoroutineCrudRepository<Room, UUID> {
    /**
     * Finds a room by its exact name.
     *
     * @param name The name of the room to find.
     * @return The [Room] entity if found, otherwise null.
     */
    suspend fun findRoomByName(name: String): Room?

    /**
     * Retrieves all rooms along with their associated building data.
     *
     * Performs a left join query to combine room and building information.
     *
     * @return A [Flow] of [RoomWithBuildingData] containing combined room and building details.
     */
    @Suppress("ktlint:standard:max-line-length")
    @Query(
        "select r.*, b.id as building_id, b.name as building_name from room r left join building b on r.building_id = b.id order by b.name, r.name",
    )
    fun findAllRoomsWithBuildings(): Flow<RoomWithBuildingData>

    /**
     * Deletes all rooms that have the specified name.
     *
     * @param name The name of the rooms to delete.
     */
    suspend fun deleteRoomsByNameEquals(name: String)
}
