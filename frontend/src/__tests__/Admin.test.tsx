import { expect, test, describe, it, vi } from "vitest"
import { render, screen } from "./test-utils"
import LoginPage from "@/app/admin/login/page"
import AdminDashboard from "@/app/admin/page"
import { act, waitFor } from "@testing-library/react"

const {
    useAuthContext,
    redirect,
    removeRoomsFromDatabase,
    removeSchedulesFromCache,
} = vi.hoisted(() => {
    return {
        useAuthContext: vi.fn(() => ({})),
        redirect: vi.fn(),
        removeRoomsFromDatabase: vi.fn(async () => {}),
        removeSchedulesFromCache: vi.fn(async () => {}),
    }
})

vi.mock("next/navigation", async () => {
    return {
        useRouter: vi.fn(),
        redirect,
    }
})

vi.mock("@/admin/auth", async () => {
    return {
        auth: {},
    }
})

vi.mock("@/admin/authData", async () => {
    return {
        removeSchedulesFromCache,
        removeRoomsFromDatabase,
    }
})

vi.mock("@/admin/AuthContext", async () => {
    return {
        useAuthContext,
    }
})

test("AdminLogin", () => {
    render(<LoginPage />)
    expect(
        screen.getByRole("heading", { level: 1, name: "Welcome back!" })
    ).toBeDefined()
})

describe("AdminDashboard", () => {
    it("should show loader if user not undefined", () => {
        render(<AdminDashboard />)
        expect(screen.getByTestId("loader")).toBeDefined()
    })

    it("should redirect to login if not logged in", () => {
        useAuthContext.mockReturnValue({
            user: null,
        })
        render(<AdminDashboard />)
        expect(redirect).toBeCalledWith("/admin/login")
    })

    it("logged in state", async () => {
        useAuthContext.mockReturnValue({
            user: {
                getIdToken: () => "",
            },
        })
        render(<AdminDashboard />)
        expect(
            screen.getByRole("heading", { level: 4, name: "Cache Actions" })
        ).toBeDefined()

        // Test Clear Cache button
        const clearCache = screen.getByRole("button", {
            name: "Clear all schedule cache data",
        })
        expect(clearCache).toBeDefined()
        act(() => {
            clearCache.click()
        })
        expect(
            screen.getByRole("button", {
                name: "Are you sure?",
            })
        ).toBeDefined()
        act(() => {
            clearCache.click()
        })
        // Wait for button to be in original state again
        await waitFor(() =>
            screen.getByRole("button", {
                name: "Clear all schedule cache data",
            })
        )
        expect(removeSchedulesFromCache).toBeCalled()

        // Test Delete Room Data
        const clearRooms = screen.getByRole("button", {
            name: "Clear all rooms",
        })
        expect(clearRooms).toBeDefined()
        act(() => {
            clearRooms.click()
        })
        expect(
            screen.getByRole("button", {
                name: "Are you sure?",
            })
        ).toBeDefined()
        act(() => {
            clearRooms.click()
        })
        // Wait for button to be in original state again
        await waitFor(() =>
            screen.getByRole("button", {
                name: "Clear all rooms",
            })
        )
        expect(removeRoomsFromDatabase).toBeCalled()
    })
})
