/// <reference types="cypress" />
import type { Map } from "maplibre-gl"

declare global {
    interface Window {
        roomfinderMap?: Map
    }

    namespace Cypress {
        interface Chainable {
            waitForMapRoom(roomName: string): Chainable<AUTWindow>
            clickMapRoom(roomName: string): Chainable<void>
            resetRooms(): Chainable<void>
        }
    }
}

// Bounded, retriable assertions using the public MapLibre API. Do not return
// third-party thenables from Cypress chains (MapGrab caused recursive chains).
Cypress.Commands.add("waitForMapRoom", (roomName) => {
    return cy.window().should((win) => {
        const map = win.roomfinderMap
        expect(map, "MapLibre loaded").to.exist
        expect(map!.isMoving(), "map animation finished").to.be.false
        expect(map!.areTilesLoaded(), "indoor tiles loaded").to.be.true
        expect(map!.getLayer("indoor-name"), "room name layer").to.exist
        const rooms = map!.queryRenderedFeatures({ layers: ["indoor-name"] })
        expect(
            rooms.some((room) => room.properties.name === roomName),
            roomName
        ).to.be.true
    })
})

Cypress.Commands.add("clickMapRoom", (roomName) => {
    cy.waitForMapRoom(roomName).then((win) => {
        const map = win.roomfinderMap!
        const feature = map
            .queryRenderedFeatures({ layers: ["indoor-name"] })
            .find((room) => room.properties.name === roomName)!
        expect(feature.geometry.type).to.equal("Point")
        if (feature.geometry.type !== "Point")
            throw new Error("Expected room point")
        const [lng, lat] = feature.geometry.coordinates
        const point = map.project([lng, lat])
        cy.get(".maplibregl-canvas").click(point.x, point.y)
    })
})

Cypress.Commands.add("resetRooms", () => {
    // Each test owns its state, including after destructive admin tests.
    cy.request("DELETE", "http://localhost:18080/api/v1/admin/room")
    cy.request("DELETE", "http://localhost:18080/api/v1/admin/schedules")
    for (const room of ["A0.04", "A5.00", "A5.04"]) {
        cy.request(`http://localhost:18080/api/v1/room/${room}`)
            .its("body.name")
            .should("eq", room)
    }
})

export {}
