import { vi, describe, it, expect } from "vitest"
import { User } from "@firebase/auth"
import { renderHook, waitFor } from "@testing-library/react"
import { AuthContextProvider, useAuthContext } from "@/admin/AuthContext"

const { onAuthStateChanged } = vi.hoisted(() => {
    return {
        onAuthStateChanged: vi
            .fn()
            .mockImplementation(
                (auth: never, userFkt: (user: User) => void) => {
                    userFkt({} as User)
                    return () => {}
                }
            ),
    }
})

// Mock the firebase auth module
vi.mock("@firebase/auth", () => ({
    onAuthStateChanged,
}))

vi.mock("@/admin/auth", () => ({
    auth: {},
}))

describe("AuthContext", () => {
    it("gets user from firebase", async () => {
        const { result } = renderHook(useAuthContext, {
            wrapper: AuthContextProvider,
        })
        await waitFor(() => expect(result.current.user).toBeDefined())
        expect(result.current.user).toEqual({})
    })
})
