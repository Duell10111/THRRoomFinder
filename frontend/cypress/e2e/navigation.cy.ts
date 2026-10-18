describe("Navigation", () => {
    beforeEach(() => cy.visit("/"))

    it("opens and closes the desktop sidebar", () => {
        cy.get('[data-testid="room-sidebar"]').should(($sidebar) => {
            expect($sidebar[0].getBoundingClientRect().left).to.be.at.least(0)
        })
        cy.get('[data-testid="nav-burger-desktop"]').click()
        // Mantine translates the sidebar offscreen. Child visibility does not
        // reliably indicate whether the sidebar is collapsed.
        cy.get('[data-testid="room-sidebar"]').should(($sidebar) => {
            expect($sidebar[0].getBoundingClientRect().right).to.be.at.most(0)
        })
        cy.get('[data-testid="nav-burger-desktop"]').click()
        cy.get('[data-testid="room-sidebar"]').should(($sidebar) => {
            expect($sidebar[0].getBoundingClientRect().left).to.be.at.least(0)
        })
        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")
    })

    it("opens and closes the mobile sidebar", () => {
        cy.viewport(390, 844)
        cy.get('[data-testid="room-sidebar"]').should(($sidebar) => {
            expect($sidebar[0].getBoundingClientRect().right).to.be.at.most(0)
        })
        cy.get('[data-testid="nav-burger-mobile"]').click()
        cy.get('[data-testid="room-sidebar"]').should(($sidebar) => {
            expect($sidebar[0].getBoundingClientRect().left).to.be.at.least(0)
        })
        cy.get('[data-testid="nav-burger-mobile"]').click()
        cy.get('[data-testid="room-sidebar"]').should(($sidebar) => {
            expect($sidebar[0].getBoundingClientRect().right).to.be.at.most(0)
        })
    })
})
