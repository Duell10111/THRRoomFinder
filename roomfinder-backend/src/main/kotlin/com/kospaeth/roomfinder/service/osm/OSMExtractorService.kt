package com.kospaeth.roomfinder.service.osm

import com.kospaeth.roomfinder.config.OSMProperties
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.reactive.function.client.awaitExchange

private val logger = KotlinLogging.logger {}

@Service
class OSMExtractorService(
    private val webClient: WebClient,
    private val osmProperties: OSMProperties,
) {
    suspend fun getIndoorRoomsForBuilding(
        areaId: String,
        name: String,
    ): OverpassResponse? {
        val query =
            """
            [out:json];

            way(id:$areaId)->.root;
            way(pivot.root)->.buildingArea;
            (
              way["indoor"="room"]["name"="$name"](area.buildingArea);
            );
            out body;
            >;
            out skel qt;
            """.trimIndent()

        logger.debug { "Running query: $query" }

        return webClient.post()
            .uri(osmProperties.overPassUrl)
            .body(BodyInserters.fromValue(query))
            .awaitExchange {
                logger.debug { "Received OSM Response: $it" }
                it.awaitBody<OverpassResponse>()
            }
    }
}
