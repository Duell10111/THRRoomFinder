package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.annotation.JsonProperty

data class SPlanRoomResponseItem(
    val id: Long,
    @JsonProperty("shortname")
    val shortName: String,
    val name: String,
)
