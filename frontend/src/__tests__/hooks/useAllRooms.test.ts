import { renderHook, act, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, Mock } from "vitest"
import { getAllRoomsWithBuildings } from "@/utils/data"
import useAllRooms from "@/hooks/useAllRooms"

vi.mock("@/utils/data", async () => {
    const actual = await vi.importActual("@/utils/data")
    return {
        ...actual,
        getAllRoomsWithBuildings: vi.fn(),
    }
})

describe("useAllRooms", () => {
    const mockRooms = [
        { id: 1, name: "Room A", buildingName: "Building 1" },
        { id: 2, name: "Room B", buildingName: "Building 2" },
        { id: 3, name: "Room C", buildingName: "Building 1" },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("fetches rooms and groups them by building name", async () => {
        act(() => {
            ;(getAllRoomsWithBuildings as unknown as Mock).mockResolvedValue(
                mockRooms
            )
        })

        const { result } = renderHook(() => useAllRooms())

        await waitFor(() =>
            expect(result.current).toEqual({
                ["Building 1"]: [
                    { id: 1, name: "Room A", buildingName: "Building 1" },
                    { id: 3, name: "Room C", buildingName: "Building 1" },
                ],
                ["Building 2"]: [
                    { id: 2, name: "Room B", buildingName: "Building 2" },
                ],
            })
        )
    })

    it("handle api errors correctly", async () => {
        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {})
        ;(getAllRoomsWithBuildings as unknown as Mock).mockRejectedValue(
            new Error("Error!")
        )

        const { result } = renderHook(() => useAllRooms())

        await waitFor(() => expect(result.current).toEqual({})) // stays empty on API error
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })
})
