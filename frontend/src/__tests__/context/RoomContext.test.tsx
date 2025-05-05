import { expect, test } from "vitest"
import { RoomContextProvider, useRoomContext } from "@/context/RoomContext"
import { act, renderHook } from "@testing-library/react"
import { RoomData } from "@/utils/data"

test("RoomContext", () => {
    const { result } = renderHook(useRoomContext, {
        wrapper: RoomContextProvider,
    })
    expect(result.current.data).toBeUndefined()
    // TODO: Add tests for setRoom
    const roomData: RoomData = {
        name: "Room",
        location: {
            lat: 0,
            lng: 0,
        },
    }

    act(() => {
        result.current.setRoomData(roomData)
    })
    expect(result.current.data?.roomData).toBe(roomData)
    expect(result.current.data?.date).toBeUndefined()
})
