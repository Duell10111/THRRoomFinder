import { expect, test } from "vitest"
import { render, screen } from "../test-utils"
import { NavLogo } from "@/navigation/NavLogo"

test("NavLogo", () => {
    render(<NavLogo />)
    expect(
        screen.getByRole("heading", { level: 2, name: "THRRoomfinder" })
    ).toBeDefined()
    expect(screen.getByAltText("Roomfinder Logo")).toBeDefined()
})
