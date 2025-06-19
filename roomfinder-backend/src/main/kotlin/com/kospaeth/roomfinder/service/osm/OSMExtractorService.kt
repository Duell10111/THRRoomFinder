package com.kospaeth.roomfinder.service.osm

import com.kospaeth.roomfinder.config.OSMProperties
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.reactive.function.client.awaitExchange

private val logger = KotlinLogging.logger {}

/**
 * Service class responsible for extracting indoor room data from OpenStreetMap using Overpass API.
 *
 * Sends Overpass QL queries to retrieve indoor room information for a specified building.
 */
@Service
class OSMExtractorService(
    private val webClient: WebClient,
    private val osmProperties: OSMProperties,
) {
    /**
     * Retrieves indoor rooms for a given building from OpenStreetMap using the Overpass API.
     *
     * Constructs and sends an Overpass QL query to fetch rooms with a matching name within a building area.
     *
     * @param areaId The OSM area ID of the building.
     * @param name The name of the indoor room to search for.
     * @return The [OverpassResponse] containing the room data, or null if no data is returned.
     */
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
