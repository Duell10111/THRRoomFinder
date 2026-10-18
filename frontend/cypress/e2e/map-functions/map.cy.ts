describe("Campus map", () => {
    beforeEach(() => {
        cy.resetRooms()
        cy.visit("/", {
            onBeforeLoad(win) {
                const position = {
                    coords: {
                        latitude: 47.86746,
                        longitude: 12.10722,
                        accuracy: 10,
                    },
                    timestamp: Date.now(),
                }
                cy.stub(
                    win.navigator.geolocation,
                    "getCurrentPosition"
                ).callsFake((success) => success(position))
                cy.stub(win.navigator.geolocation, "watchPosition").callsFake(
                    (success) => {
                        success(position)
                        return 1
                    }
                )
                cy.stub(win.navigator.geolocation, "clearWatch")
            },
        })
    })

    it("selects rooms by clicking and switching floors", () => {
        cy.clickMapRoom("A0.04")
        cy.get(".maplibregl-popup-content").should("be.visible")
        cy.get('[data-testid="roomData-name"]').should(
            "have.text",
            "Name: A0.04"
        )
        cy.window().should((win) => {
            const features = win.roomfinderMap!.queryRenderedFeatures({
                layers: ["highlight-room-layer"],
            })
            expect(
                features.some((feature) => feature.properties.name === "A0.04")
            ).to.be.true
        })
        cy.contains(".maplibregl-ctrl-indoorequal button", /^5$/).click()
        cy.get(".maplibregl-popup-content").should("not.exist")
        cy.clickMapRoom("A5.04")
        cy.get(".maplibregl-popup-content").should("be.visible")
        cy.get('[data-testid="roomData-name"]').should(
            "have.text",
            "Name: A5.04"
        )
    })

    it("selects a room and switches floors using the search field", () => {
        cy.waitForMapRoom("A0.04")
        cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")
        cy.get('[data-testid="roomData-name"]').should(
            "have.text",
            "Name: A5.00"
        )
        cy.waitForMapRoom("A5.00")
        cy.contains(".maplibregl-ctrl-indoorequal button", /^5$/).should(
            "have.class",
            "maplibregl-ctrl-active"
        )
    })

    it("shows the user's geolocation", () => {
        cy.waitForMapRoom("A0.04")
        cy.get(".maplibregl-ctrl-geolocate").should("be.enabled").click()
        cy.get(".maplibregl-user-location-dot").should("be.visible")
    })
})
