package com.kospaeth.roomfinder.config

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@ConfigurationProperties(prefix = "roomfinder")
data class AppProperties(
    val adminIds: List<String> = emptyList(),
)

@ConfigurationProperties(prefix = "room-finder.splan")
@Validated
data class SPlanProperties(
    @field:NotEmpty val url: String,
)

@ConfigurationProperties(prefix = "room-finder.osm")
@Validated
data class OSMProperties(
    @field:NotEmpty val overPassUrl: String,
    @field:Valid val buildingWayIds: List<OSMBuildingProperties> = emptyList(),
)

@Validated
data class OSMBuildingProperties(
    @field:NotEmpty val regex: String,
    @field:NotEmpty val buildingId: String,
) {
    val regexObject: Regex
        get() = regex.toRegex()
}
