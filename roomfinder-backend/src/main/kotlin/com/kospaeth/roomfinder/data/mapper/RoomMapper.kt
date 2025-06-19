package com.kospaeth.roomfinder.data.mapper

import com.kospaeth.roomfinder.data.dto.ExtendedRoomDTO
import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.data.entities.Room
import com.kospaeth.roomfinder.data.entities.RoomWithBuildingData
import org.mapstruct.Mapper
import org.mapstruct.NullValueCheckStrategy
import org.mapstruct.ReportingPolicy
import org.springframework.data.geo.Point

/**
 * Mapper class for converting between room entities and their corresponding DTOs.
 *
 * This abstract class uses MapStruct for automatic implementation generation.
 */
@Mapper(
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    unmappedSourcePolicy = ReportingPolicy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
)
abstract class RoomMapper {
    /**
     * Maps a [Room] entity to a [RoomDTO].
     *
     * @param room The Room entity to convert.
     * @return A RoomDTO representing the given Room.
     */
    abstract fun toDTO(room: Room): RoomDTO

    /**
     * Maps a [RoomDTO] to a [Room] entity.
     *
     * @param dto The RoomDTO to convert.
     * @return A Room entity representing the given DTO.
     */
    abstract fun toEntity(dto: RoomDTO): Room

    /**
     * Maps a [RoomWithBuildingData] projection to an [ExtendedRoomDTO].
     *
     * @param entity The entity containing room and building data.
     * @return An ExtendedRoomDTO with combined room and building information.
     */
    abstract fun toDTO(entity: RoomWithBuildingData): ExtendedRoomDTO

    /**
     * Converts a [Point] object into a [LocationDTO].
     *
     * @param location A geographic point with x (latitude) and y (longitude).
     * @return A LocationDTO with the same coordinates.
     */
    fun toLocationDTO(location: Point): LocationDTO {
        return LocationDTO(
            location.x,
            location.y,
        )
    }

    /**
     * Converts a [LocationDTO] into a [Point] object.
     *
     * @param location A LocationDTO containing latitude and longitude.
     * @return A Point with the same coordinates.
     */
    fun toPoint(location: LocationDTO): Point {
        return Point(
            location.lat,
            location.lng,
        )
    }
}
