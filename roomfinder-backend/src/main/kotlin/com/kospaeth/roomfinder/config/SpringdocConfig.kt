package com.kospaeth.roomfinder.config

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import org.springframework.context.annotation.Configuration

@Configuration
@OpenAPIDefinition(
    info = Info(title = "Roomfinder Backend", version = "v1"),
)
class SpringdocConfig
