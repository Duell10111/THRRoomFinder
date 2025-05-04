import { expect, test, vi } from "vitest"
import { render, screen, fireEvent } from "../../test-utils"
import { RoomButton } from "@/components/admin/RoomButton"

vi.mock("@/admin/auth", async () => {
    return {
        auth: {},
    }
})

test("RoomButton", () => {
    render(<RoomButton />)
    const btn = screen.getByRole("button", { name: "Delete Room" })
    expect(btn).toBeDefined()
    fireEvent.click(btn)
})
