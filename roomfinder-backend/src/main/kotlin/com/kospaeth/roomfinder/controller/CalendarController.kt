package com.kospaeth.roomfinder.controller

import com.kospaeth.roomfinder.service.ICalService
import com.nimbusds.jose.util.Base64
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "Calendar API")
@RequestMapping(ControllerStruct.CALENDAR_CONTROLLER, produces = ["text/calendar"])
@RestController
class CalendarController(
    private val iCalService: ICalService,
) {
    @Operation(summary = "Enhance iCal calendar with room locations")
    @GetMapping("/")
    suspend fun enhanceICal(
        @Parameter(description = "iCal Url from SPlan", required = true) @RequestParam iCalUrl: String,
    ): String {
        return iCalService.enhanceICalURLWithLocations(Base64.from(iCalUrl).decodeToString())
    }
}
