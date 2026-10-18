const email = "admin@example.test"
const password = "local-e2e-password"
const authEmulator = "http://localhost:19099"

describe("Admin dashboard", () => {
    beforeEach(() => {
        cy.resetRooms()
        cy.request(
            "DELETE",
            `${authEmulator}/emulator/v1/projects/demo-roomfinder/accounts`
        )
        cy.request(
            "POST",
            `${authEmulator}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=e2e-api-key`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        )
        cy.visit("/admin/login")
        cy.get('[data-testid="login-email"]').type(email)
        cy.get('[data-testid="login-password"]').type(password, { log: false })
        cy.get('[data-testid="login-submit"]').click()
        cy.location("pathname").should("eq", "/admin")
        cy.get('[data-testid="clear-room-data"]').should("be.visible")
    })

    it("clears the schedule cache after confirmation", () => {
        cy.intercept(
            "DELETE",
            "http://localhost:18080/api/v1/admin/schedules"
        ).as("clear")
        cy.get('[data-testid="clear-schedule-data"]').click()
        cy.get('[data-testid="clear-schedule-data"]')
            .should("have.text", "Are you sure?")
            .click()
        cy.wait("@clear").its("response.statusCode").should("eq", 200)
        cy.contains("All schedules deleted from cache").should("be.visible")
    })

    it("deletes all rooms after confirmation", () => {
        cy.intercept("DELETE", "http://localhost:18080/api/v1/admin/room").as(
            "clear"
        )
        cy.get('[data-testid="clear-room-data"]').click()
        cy.get('[data-testid="clear-room-data"]')
            .should("have.text", "Are you sure?")
            .click()
        cy.wait("@clear").its("response.statusCode").should("eq", 200)
        cy.contains("All rooms deleted from database").should("be.visible")
        cy.request("http://localhost:18080/api/v1/room/")
            .its("body")
            .should("deep.eq", [])
    })

    it("deletes only the selected room", () => {
        cy.intercept(
            "DELETE",
            "http://localhost:18080/api/v1/admin/room/A5.00"
        ).as("clear")
        cy.get('[data-testid="autocomplete-input"]').type("A5.00{enter}")
        cy.get('[data-testid="clear-specific-room-data-btn"]').click()
        cy.wait("@clear").its("response.statusCode").should("eq", 200)
        cy.contains("Deleted room from database").should("be.visible")
        cy.request("http://localhost:18080/api/v1/room/")
            .its("body")
            .then((rooms) => {
                expect(
                    rooms.map((room: { name: string }) => room.name)
                ).to.have.members(["A0.04", "A5.04"])
            })
    })

    it("reports a failed delete without showing success", () => {
        cy.intercept("DELETE", "http://localhost:18080/api/v1/admin/room", {
            statusCode: 500,
        }).as("failedDelete")
        cy.get('[data-testid="clear-room-data"]').click()
        cy.get('[data-testid="clear-room-data"]')
            .should("have.text", "Are you sure?")
            .click()
        cy.wait("@failedDelete")
        cy.contains("Could not delete rooms (HTTP 500)").should("be.visible")
        cy.contains("All rooms deleted from database").should("not.exist")
        cy.request("http://localhost:18080/api/v1/room/")
            .its("body")
            .should("have.length", 3)
    })
})
