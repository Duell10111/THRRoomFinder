describe("Navigation Tests", () => {
    beforeEach(() => {
        cy.viewport("macbook-16", "portrait")
        try {
            cy.visit("http://localhost:3000")
        } catch (e) {
            console.error(e)
        }
    })
    it("NavBar can be opened and closed correctly", () => {
        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")
    })
})
