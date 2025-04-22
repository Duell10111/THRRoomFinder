import { expect, test } from "vitest"
import { render, screen } from "./test-utils"
import Impressum from "@/sites/Impressum"

test("Impressum", () => {
    render(<Impressum />)
    expect(
        screen.getByRole("heading", { level: 1, name: "Impressum" })
    ).toBeDefined()
    expect(
        screen.getByRole("heading", { level: 4, name: "Haftung für Links" })
    ).toBeDefined()
})
