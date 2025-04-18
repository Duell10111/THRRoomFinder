package com.kospaeth.roomfinder.data.repository

import com.kospaeth.roomfinder.data.entities.Room
import com.kospaeth.roomfinder.data.entities.RoomWithBuildingData
import kotlinx.coroutines.flow.Flow
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.util.UUID

interface RoomRepository : CoroutineCrudRepository<Room, UUID> {
    suspend fun findRoomByName(name: String): Room?

    @Suppress("ktlint:standard:max-line-length")
    @Query(
        "select r.*, b.id as building_id, b.name as building_name from room r left join building b on r.building_id = b.id order by b.name, r.name",
    )
    suspend fun findAllRoomsWithBuildings(): Flow<RoomWithBuildingData>
}
