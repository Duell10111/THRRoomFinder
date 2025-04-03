package com.kospaeth.roomfinder.data.mapper

import com.kospaeth.roomfinder.data.dto.LocationDTO
import com.kospaeth.roomfinder.data.dto.RoomDTO
import com.kospaeth.roomfinder.data.entities.Room
import org.mapstruct.Mapper
import org.mapstruct.NullValueCheckStrategy
import org.mapstruct.ReportingPolicy
import org.springframework.data.geo.Point

@Mapper(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
abstract class RoomMapper {
    abstract fun toDTO(room: Room): RoomDTO

    abstract fun toEntity(dto: RoomDTO): Room

    fun toLocationDTO(location: Point): LocationDTO {
        return LocationDTO(
            location.x,
            location.y,
        )
    }

    fun toPoint(location: LocationDTO): Point {
        return Point(
            location.lat,
            location.lng,
        )
    }
}
