import { expect, test, vi } from "vitest"
import { render, screen } from "../test-utils"
import { MapPage } from "@/sites/MapPage"

vi.mock("@/hooks/useAllRooms", async () => {
    return {
        default: () => ({}),
    }
})

test("MapPage", () => {
    render(<MapPage />)
    expect(
        screen.getByPlaceholderText("Pick room or enter anything")
    ).toBeDefined()
})
