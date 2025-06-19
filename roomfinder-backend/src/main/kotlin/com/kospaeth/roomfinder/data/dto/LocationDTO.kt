package com.kospaeth.roomfinder.data.dto

/**
 * Data Transfer Object (DTO) representing a geographical location.
 *
 * @property lat The latitude of the location.
 * @property lng The longitude of the location.
 */
data class LocationDTO(
    val lat: Double,
    val lng: Double,
)
