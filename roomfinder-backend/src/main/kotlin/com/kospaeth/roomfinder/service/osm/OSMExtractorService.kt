package com.kospaeth.roomfinder.service.osm

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitExchange

private val logger = KotlinLogging.logger {}

@Service
class OSMExtractorService(
    private val webClient: WebClient,
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

        // TODO: Catching a error here!
        return webClient.post()
            .uri("https://overpass-api.de/api/interpreter")
            .body(BodyInserters.fromValue(query))
            .awaitExchange {
                logger.info { it }
                it.toEntity(OverpassResponse::class.java).awaitSingle()
            }.body
    }

    // TODO: Calculate Point for location nodes
    private fun getCenterOfLocationPoints(): Pair<Double, Double> {
        return Pair(0.0, 0.0)
    }
}
