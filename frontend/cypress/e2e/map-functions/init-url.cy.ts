import { MapLocator } from "@mapgrab/cypress"

describe("Map URL Tests", () => {
    it("Test Map URL with room name", () => {
        cy.viewport("macbook-16", "portrait")
        cy.visit("http://localhost:3000/A0.04")

        cy.mapController("mainMap").then((controller) => {
            return controller.waitToMapLoaded({ timeout: 10000 })
        })

        cy.mapLocator(
            'layer[id=indoor-name] filter["==", ["get", "name"], "A0.04"]'
        ).first<MapLocator>()
    })

    it("Test Map URL with room name on different level", () => {
        cy.viewport("macbook-16", "portrait")
        cy.visit("http://localhost:3000/A5.04")

        cy.mapController("mainMap").then((controller) => {
            return controller.waitToMapLoaded({ timeout: 10000 })
        })

        cy.mapLocator(
            'layer[id=indoor-name] filter["==", ["get", "name"], "A5.04"]'
        ).first<MapLocator>()
    })
})
