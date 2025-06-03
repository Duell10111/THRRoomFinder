describe("Navigation Tests", () => {
    context("MacBook-16", () => {
        beforeEach(() => {
            cy.viewport("macbook-16", "portrait")
            try {
                cy.visit("http://localhost:3000")
            } catch (e) {
                console.error(e)
            }
        })
        it("NavBar can be opened and closed correctly", () => {
            cy.get('[data-testid="room-details-no-selection"]').should(
                "be.visible"
            )

            cy.get('[data-testid="nav-burger-desktop"]').click()

            cy.get('[data-testid="room-details-no-selection"]').should(
                "not.be.visible"
            )

            cy.get('[data-testid="nav-burger-desktop"]').click()

            cy.get('[data-testid="room-details-no-selection"]').should(
                "be.visible"
            )
        })
    })

    context("iPad Portrait", () => {
        beforeEach(() => {
            cy.viewport("ipad-2", "portrait")
            try {
                cy.visit("http://localhost:3000")
            } catch (e) {
                console.error(e)
            }
        })
        it("NavBar can be opened and closed correctly", () => {
            cy.get('[data-testid="room-details-no-selection"]').should(
                "be.visible"
            )

            cy.get('[data-testid="nav-burger-desktop"]').click()

            cy.get('[data-testid="room-details-no-selection"]').should(
                "not.be.visible"
            )

            cy.get('[data-testid="nav-burger-desktop"]').click()

            cy.get('[data-testid="room-details-no-selection"]').should(
                "be.visible"
            )
        })
    })

    context("iPad Landscape", () => {
        beforeEach(() => {
            cy.viewport("ipad-2", "landscape")
            try {
                cy.visit("http://localhost:3000")
            } catch (e) {
                console.error(e)
            }
        })
        it("NavBar can be opened and closed correctly", () => {
            cy.get('[data-testid="room-details-no-selection"]').should(
                "be.visible"
            )

            cy.get('[data-testid="nav-burger-desktop"]').click()

            cy.get('[data-testid="room-details-no-selection"]').should(
                "not.be.visible"
            )

            cy.get('[data-testid="nav-burger-desktop"]').click()

            cy.get('[data-testid="room-details-no-selection"]').should(
                "be.visible"
            )
        })
    })

    // context("iPhone Portrait", () => {
    //     beforeEach(() => {
    //         cy.viewport("iphone-xr", "portrait")
    //         try {
    //             cy.visit("http://localhost:3000")
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })
    //     it("NavBar can be opened and closed correctly", () => {
    //         // Not visible on default on iPhone
    //         cy.get('[data-testid="room-details-no-selection"]').should(
    //             "not.be.visible"
    //         )
    //
    //         cy.get('[data-testid="nav-burger-mobile"]').click()
    //
    //         cy.get('[data-testid="room-details-no-selection"]').should(
    //             "be.visible"
    //         )
    //
    //         cy.get('[data-testid="nav-burger-mobile"]').click()
    //
    //         cy.get('[data-testid="room-details-no-selection"]').should(
    //             "not.be.visible"
    //         )
    //     })
    // })
})
