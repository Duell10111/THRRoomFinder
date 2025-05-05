import { expect, test } from "vitest"
import { render, screen } from "@/__tests__/test-utils"
import { RoomContextProvider } from "@/context/RoomContext"

test("RoomContext", () => {
    render(
        <RoomContextProvider>
            <></>
        </RoomContextProvider>
    )
    expect(
        screen.getByRole("heading", { level: 2, name: "THRRoomfinder" })
    ).toBeDefined()
    expect(screen.getByAltText("Roomfinder Logo")).toBeDefined()
})
