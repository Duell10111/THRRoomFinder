package com.kospaeth.roomfinder.service.splan

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDate

@JsonIgnoreProperties(ignoreUnknown = true)
data class SPlanPUResponseItem(
    val id: Int,
    val shortname: String,
    val name: String,
    @JsonProperty("startdate")
    @field:JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,
    @JsonProperty("enddate")
    @field:JsonFormat(pattern = "yyyy-MM-dd")
    val endDate: LocalDate,
)
