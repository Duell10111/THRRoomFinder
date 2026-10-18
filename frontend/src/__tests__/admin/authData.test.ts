import { afterEach, describe, expect, it, vi } from "vitest"
import {
    removeRoomFromDatabase,
    removeRoomsFromDatabase,
    removeSchedulesFromCache,
} from "@/admin/authData"
import { backendUrl } from "@/utils/const"

const fetchMock = vi.fn()
vi.stubGlobal("fetch", fetchMock)

const expectedRequest = {
    method: "DELETE",
    headers: { Authorization: "Bearer token" },
}

const cases = [
    {
        name: "removeRoomFromDatabase",
        call: () => removeRoomFromDatabase("token", "A0.04"),
        url: `${backendUrl}/api/v1/admin/room/A0.04`,
        error: "Could not delete room (HTTP 500)",
    },
    {
        name: "removeRoomsFromDatabase",
        call: () => removeRoomsFromDatabase("token"),
        url: `${backendUrl}/api/v1/admin/room`,
        error: "Could not delete rooms (HTTP 500)",
    },
    {
        name: "removeSchedulesFromCache",
        call: () => removeSchedulesFromCache("token"),
        url: `${backendUrl}/api/v1/admin/schedules`,
        error: "Could not clear schedules (HTTP 500)",
    },
]

describe.each(cases)("$name", ({ call, url, error }) => {
    afterEach(() => fetchMock.mockReset())

    it("sends an authorized DELETE request", async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

        await expect(call()).resolves.toBeUndefined()
        expect(fetchMock).toHaveBeenCalledWith(url, expectedRequest)
    })

    it("throws when the backend rejects the request", async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 500 }))

        await expect(call()).rejects.toThrow(error)
    })
})
