import { expect, test } from "vitest"
import { render, screen } from "../test-utils"
import { MapPage } from "@/sites/MapPage"

test("MapPage", () => {
    render(<MapPage />)
    expect(
        screen.getByPlaceholderText("Pick room or enter anything")
    ).toBeDefined()
})
