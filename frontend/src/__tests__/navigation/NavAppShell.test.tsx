import { expect, test } from "vitest"
import { render, screen } from "../test-utils"
import { NavAppShell } from "@/navigation/NavAppShell"

test("NavAppShell", () => {
    render(
        <NavAppShell>
            <></>
        </NavAppShell>
    )
    expect(
        screen.getByRole("heading", { level: 2, name: "THRRoomfinder" })
    ).toBeDefined()
    expect(screen.getByAltText("Roomfinder Logo")).toBeDefined()
})
