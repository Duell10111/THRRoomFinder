import "./commands"

beforeEach(() => {
    // Keep real MapLibre/IndoorEqual rendering; replace only external map data.
    cy.intercept("GET", "https://basemaps.cartocdn.com/**/style.json", {
        fixture: "e2e/map-style.json",
    })
    cy.intercept("GET", "https://api.maptiler.com/maps/**/style.json*", {
        fixture: "e2e/map-style.json",
    })
    cy.intercept("GET", "https://tiles.indoorequal.org/?*", {
        fixture: "e2e/indoor-tilejson.json",
    })
})
