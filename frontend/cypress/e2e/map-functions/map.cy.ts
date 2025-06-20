import { MapLocator } from "@mapgrab/cypress"

describe("Campus Map Tests", () => {
    beforeEach(() => {
        cy.viewport("macbook-16", "portrait")
        cy.visit(
            "http://localhost:3000",
            mockLocation(47.867389349999996, 12.10707175)
        )
    })

    it("general room click and floor switch works as expected", () => {
        cy.mapController("mainMap").then((controller) => {
            return controller.waitToMapLoaded()
        })
        cy.mapLocator(
            'layer[id=indoor-name] filter["==", ["get", "name"], "A0.04"]'
        )
            .first<MapLocator>()
            .then((locator) => locator.click())

        // Check that popup appears - Content dynamic
        cy.get(".maplibregl-popup-content")

        cy.mapLocator(
            'layer[id=highlight-room-layer] filter["==", ["get", "id"], "A0.04"]'
        ).first<MapLocator>()

        cy.get('[data-testid="roomData-name"]')
            .contains("A0.04")
            .should("be.visible")

        // Switch floor to 5th
        cy.get(".maplibregl-ctrl-indoorequal > :nth-child(1)").trigger("click")

        cy.mapLocator(
            'layer[id=indoor-name] filter["==", ["get", "name"], "A5.04"]'
        )
            .first<MapLocator>()
            .then((locator) => locator.click())

        // Check that popup appears - Content dynamic
        cy.get(".maplibregl-popup-content")

        cy.get('[data-testid="roomData-name"]').contains("A5.04")
    })

    it("room selection via input box", () => {
        cy.mapController("mainMap").then((controller) => {
            return controller.waitToMapLoaded()
        })
        cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")

        cy.get('[data-testid="roomData-name"]').contains("A5.00")

        cy.mapLocator(
            'layer[id=indoor-name] filter["==", ["get", "name"], "A5.04"]'
        ).first<MapLocator>()
    })

    it("test geolocation button works", () => {
        cy.mapController("mainMap").then((controller) => {
            return controller.waitToMapLoaded()
        })

        // Click geolocate me button
        cy.get(".maplibregl-ctrl-geolocate").trigger("click")

        // Check if geolocation button is shown
        cy.get(".maplibregl-user-location-dot")
    })
})

function mockLocation(latitude: number, longitude: number) {
    return {
        onBeforeLoad(win: any) {
            cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(
                (cb, err) => {
                    if (latitude && longitude) {
                        return cb({ coords: { latitude, longitude } })
                    }

                    throw err({ code: 1 })
                }
            )
        },
    }
}
