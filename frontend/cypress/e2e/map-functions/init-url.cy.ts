describe("Room URLs", () => {
    beforeEach(() => cy.resetRooms())

    for (const room of ["A0.04", "A5.04"]) {
        it(`selects ${room} and its floor from the URL`, () => {
            cy.intercept(
                "GET",
                `http://localhost:18080/api/v1/room/${room}`
            ).as("room")
            cy.intercept(
                "GET",
                `http://localhost:18080/api/v1/room/${room}/schedule`
            ).as("schedule")
            cy.visit(`/${room}`)
            cy.wait("@room").its("response.statusCode").should("eq", 200)
            cy.wait("@schedule").then(({ response }) => {
                expect(response?.statusCode).to.equal(200)
                expect(response?.body).to.have.length(1)
                expect(response?.body[0]).to.include({
                    room,
                    name: "E2E lecture",
                })
            })
            cy.get('[data-testid="roomData-name"]').should(
                "have.text",
                `Name: ${room}`
            )
            cy.waitForMapRoom(room)
            cy.contains(".maplibregl-ctrl-indoorequal button", room[1]).should(
                "have.class",
                "maplibregl-ctrl-active"
            )
        })
    }
})
