import { expect, test, vi } from "vitest"
import { render, screen } from "./test-utils"
import LoginPage from "@/app/admin/login/page"
import AdminDashboard from "@/app/admin/page"

vi.mock("next/navigation", async () => {
    return {
        useRouter: vi.fn(),
    }
})

vi.mock("@/admin/auth", async () => {
    return {
        auth: {},
    }
})

test("AdminLogin", () => {
    render(<LoginPage />)
    expect(
        screen.getByRole("heading", { level: 1, name: "Welcome back!" })
    ).toBeDefined()
})

test("AdminDashboard", () => {
    render(<AdminDashboard />)
    expect(
        screen.getByRole("heading", { level: 4, name: "Cache Actions" })
    ).toBeDefined()
})
