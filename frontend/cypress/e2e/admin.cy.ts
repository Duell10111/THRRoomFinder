describe("Admin Dashboard Tests", () => {
    context("MacBook-16", () => {
        beforeEach(() => {
            cy.viewport("macbook-16", "portrait")
            loginAdminUser()
            cy.visit("http://localhost:3000/admin")
        })

        it("Schedule Data can be cleared", () => {
            // Double click schedule data delete button
            cy.get('[data-testid="clear-schedule-data"]').click()
            cy.get('[data-testid="clear-schedule-data"]').click()

            cy.contains("Cleared schedules").should("be.visible")
            cy.contains("All schedules deleted from cache").should("be.visible")
        })

        it("Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="clear-room-data"]').click()
            cy.get('[data-testid="clear-room-data"]').click()

            cy.contains("Cleared rooms").should("be.visible")
            cy.contains("All rooms deleted from database").should("be.visible")
        })

        it("Specific Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")

            cy.get('[data-testid="clear-specific-room-data-btn"]').click()

            cy.contains("Deleted room").should("be.visible")
            cy.contains("Deleted room from database").should("be.visible")
        })
    })

    context("iPad Portrait", () => {
        beforeEach(() => {
            cy.viewport("ipad-2", "portrait")
            loginAdminUser()
            cy.visit("http://localhost:3000/admin")
        })

        it("Schedule Data can be cleared", () => {
            // Double click schedule data delete button
            cy.get('[data-testid="clear-schedule-data"]').click()
            cy.get('[data-testid="clear-schedule-data"]').click()

            cy.contains("Cleared schedules").should("be.visible")
            cy.contains("All schedules deleted from cache").should("be.visible")
        })

        it("Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="clear-room-data"]').click()
            cy.get('[data-testid="clear-room-data"]').click()

            cy.contains("Cleared rooms").should("be.visible")
            cy.contains("All rooms deleted from database").should("be.visible")
        })

        it("Specific Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")

            cy.get('[data-testid="clear-specific-room-data-btn"]').click()

            cy.contains("Deleted room").should("be.visible")
            cy.contains("Deleted room from database").should("be.visible")
        })
    })

    context("iPad Landscape", () => {
        beforeEach(() => {
            cy.viewport("ipad-2", "landscape")
            loginAdminUser()
            cy.visit("http://localhost:3000/admin")
        })

        it("Schedule Data can be cleared", () => {
            // Double click schedule data delete button
            cy.get('[data-testid="clear-schedule-data"]').click()
            cy.get('[data-testid="clear-schedule-data"]').click()

            cy.contains("Cleared schedules").should("be.visible")
            cy.contains("All schedules deleted from cache").should("be.visible")
        })

        it("Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="clear-room-data"]').click()
            cy.get('[data-testid="clear-room-data"]').click()

            cy.contains("Cleared rooms").should("be.visible")
            cy.contains("All rooms deleted from database").should("be.visible")
        })

        it("Specific Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")

            cy.get('[data-testid="clear-specific-room-data-btn"]').click()

            cy.contains("Deleted room").should("be.visible")
            cy.contains("Deleted room from database").should("be.visible")
        })
    })

    context("iPhone Portrait", () => {
        beforeEach(() => {
            cy.viewport("iphone-xr", "portrait")
            loginAdminUser()
            cy.visit("http://localhost:3000/admin")
        })

        it("Schedule Data can be cleared", () => {
            // Double click schedule data delete button
            cy.get('[data-testid="clear-schedule-data"]').click()
            cy.get('[data-testid="clear-schedule-data"]').click()

            cy.contains("Cleared schedules").should("be.visible")
            cy.contains("All schedules deleted from cache").should("be.visible")
        })

        it("Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="clear-room-data"]').click()
            cy.get('[data-testid="clear-room-data"]').click()

            cy.contains("Cleared rooms").should("be.visible")
            cy.contains("All rooms deleted from database").should("be.visible")
        })

        it("Specific Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")

            cy.get('[data-testid="clear-specific-room-data-btn"]').click()

            cy.contains("Deleted room").should("be.visible")
            cy.contains("Deleted room from database").should("be.visible")
        })
    })

    context("iPhone Landscape", () => {
        beforeEach(() => {
            cy.viewport("iphone-xr", "landscape")
            loginAdminUser()
            cy.visit("http://localhost:3000/admin")
        })

        it("Schedule Data can be cleared", () => {
            // Double click schedule data delete button
            cy.get('[data-testid="clear-schedule-data"]').click()
            cy.get('[data-testid="clear-schedule-data"]').click()

            cy.contains("Cleared schedules").should("be.visible")
            cy.contains("All schedules deleted from cache").should("be.visible")
        })

        it("Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="clear-room-data"]').click()
            cy.get('[data-testid="clear-room-data"]').click()

            cy.contains("Cleared rooms").should("be.visible")
            cy.contains("All rooms deleted from database").should("be.visible")
        })

        it("Specific Room Data can be cleared", () => {
            // Double click room data delete button
            cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")

            cy.get('[data-testid="clear-specific-room-data-btn"]').click()

            cy.contains("Deleted room").should("be.visible")
            cy.contains("Deleted room from database").should("be.visible")
        })
    })
})

function loginAdminUser() {
    const email = Cypress.env("ADMIN_EMAIL")
    const password = Cypress.env("ADMIN_PASSWORD")
    cy.session([email, password], () => {
        cy.visit("http://localhost:3000/admin/login")
        cy.get('[data-testid="login-email"]').type(email)
        cy.get('[data-testid="login-password"]').type(password)
        cy.get('[data-testid="login-submit"]').click()
        cy.url().should("not.contain", "/login")
    })
}
