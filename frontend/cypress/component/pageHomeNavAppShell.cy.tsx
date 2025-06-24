import React from "react"
import { MantineProvider } from "@mantine/core"
import { NavAppShell } from "@/navigation/NavAppShell"

// Needed for Mantine UI styling
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"

describe("<Home />", () => {
    it("renders PC variant correctly", () => {
        // see: https://on.cypress.io/mounting-react
        cy.viewport("macbook-16", "portrait")
        cy.mount(
            <MantineProvider>
                <NavAppShell>
                    <></>
                </NavAppShell>
            </MantineProvider>
        )

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")
    })

    it("renders iPad portrait variant correctly", () => {
        cy.viewport("ipad-2", "portrait")
        cy.mount(
            <MantineProvider>
                <NavAppShell>
                    <></>
                </NavAppShell>
            </MantineProvider>
        )

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")
    })

    it("renders iPad landscape variant correctly", () => {
        cy.viewport("ipad-2", "landscape")
        cy.mount(
            <MantineProvider>
                <NavAppShell>
                    <></>
                </NavAppShell>
            </MantineProvider>
        )

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )

        cy.get('[data-testid="nav-burger-desktop"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")
    })

    it("renders iPhone portrait variant correctly", () => {
        cy.viewport("iphone-6", "portrait")
        cy.mount(
            <MantineProvider>
                <NavAppShell>
                    <></>
                </NavAppShell>
            </MantineProvider>
        )

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )

        cy.get('[data-testid="nav-burger-mobile"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")

        cy.get('[data-testid="nav-burger-mobile"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )
    })

    it("renders iPhone landscape variant correctly", () => {
        cy.viewport("iphone-6", "landscape")
        cy.mount(
            <MantineProvider>
                <NavAppShell>
                    <></>
                </NavAppShell>
            </MantineProvider>
        )

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )

        cy.get('[data-testid="nav-burger-mobile"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should("be.visible")

        cy.get('[data-testid="nav-burger-mobile"]').click()

        cy.get('[data-testid="room-details-no-selection"]').should(
            "not.be.visible"
        )
    })
})
