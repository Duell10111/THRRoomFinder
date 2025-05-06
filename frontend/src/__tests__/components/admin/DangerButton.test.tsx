import { expect, test, vi } from "vitest"
import { render, screen, fireEvent } from "../../test-utils"
import { DangerButton } from "@/components/admin/DangerButton"

vi.mock("@/admin/auth", async () => {
    return {
        auth: {},
    }
})

test("DangerButton", () => {
    render(<DangerButton label={"Button label"} action={async () => {}} />)
    const btn = screen.getByRole("button", { name: "Button label" })
    expect(btn).toBeDefined()
    fireEvent.click(btn)
})
