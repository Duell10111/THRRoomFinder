import { expect, describe, it, vi } from "vitest"
import { RoomContextProvider, useRoomContext } from "@/context/RoomContext"
import { act, renderHook, waitFor } from "@testing-library/react"
import { RoomData, ScheduleData } from "@/utils/data"
import React from "react"

const { getRoom, getScheduleData, getScheduleDataRelatedToRoom } = vi.hoisted(
    () => {
        return {
            getRoom: vi.fn(),
            getScheduleData: vi.fn(async () => [] as ScheduleData[]),
            getScheduleDataRelatedToRoom: vi.fn(async () => {}),
        }
    }
)

// Mock the data fetching functions
vi.mock("@/utils/data", () => ({
    getRoom,
    getScheduleData,
    getScheduleDataRelatedToRoom,
}))

const { campus } = vi.hoisted(() => {
    return {
        campus: {
            flyTo: vi.fn(),
            getMap: () => campus,
            getStyle: () => ({
                sources: {},
                layers: [],
            }),
            getSource: vi.fn().mockReturnValue({
                setData: vi.fn(),
            }),
        },
    }
})

// Mock the maplibre functions
vi.mock("react-map-gl/maplibre", () => ({
    useMap: () => ({ campus }),
}))

const HomeParamsWrapper = ({ children }: { children: React.ReactNode }) => (
    <RoomContextProvider homeParams={Promise.resolve({ slug: ["A0.03"] })}>
        {children}
    </RoomContextProvider>
)

describe("RoomContext", () => {
    it("test setRoom", () => {
        const { result } = renderHook(useRoomContext, {
            wrapper: RoomContextProvider,
        })
        expect(result.current.data).toBeUndefined()
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

        act(() => {
            result.current.setDate(new Date())
        })
    })

    it("should setData with setRoom", async () => {
        const { result } = renderHook(useRoomContext, {
            wrapper: RoomContextProvider,
        })
        expect(result.current.data).toBeUndefined()

        getRoom.mockReturnValueOnce(
            Promise.resolve({
                name: "Room B",
                location: {
                    lat: 0,
                    lng: 0,
                },
            })
        )

        getScheduleData.mockReturnValueOnce(
            Promise.resolve([
                {
                    location: "RO",
                    room: "Room B",
                    name: "Grundlagen der Bauphysik",
                    lecturer: "Praktikum, Prof.Dr. Johannes Aschaber",
                    relevantDegrees: "IPB-B2",
                    startTime: "2025-04-07T11:45:00",
                    endTime: "2025-04-07T13:15:00",
                },
            ])
        )

        expect(getRoom).not.toHaveBeenCalled()
        expect(getScheduleData).not.toHaveBeenCalled()
        expect(campus.flyTo).not.toHaveBeenCalled()

        await act(async () => {
            await result.current.setRoom("Room B", true)
        })

        expect(getRoom).toHaveBeenCalled()
        expect(getScheduleData).toHaveBeenCalled()
        expect(campus.flyTo).toHaveBeenCalled()
        expect(result.current.data?.scheduleData).toStrictEqual({
            "Room B": [
                {
                    location: "RO",
                    room: "Room B",
                    name: "Grundlagen der Bauphysik",
                    lecturer: "Praktikum, Prof.Dr. Johannes Aschaber",
                    relevantDegrees: "IPB-B2",
                    startTime: "2025-04-07T11:45:00",
                    endTime: "2025-04-07T13:15:00",
                },
            ],
        })
    })

    it("should setData with homeParams", async () => {
        getRoom.mockReturnValueOnce(
            Promise.resolve({
                name: "A0.03",
                location: {
                    lat: 0,
                    lng: 0,
                },
            })
        )
        getScheduleData.mockReturnValueOnce(
            Promise.resolve([
                {
                    location: "RO",
                    room: "A0.03",
                    name: "Grundlagen der Bauphysik",
                    lecturer: "Praktikum, Prof.Dr. Johannes Aschaber",
                    relevantDegrees: "IPB-B2",
                    startTime: "2025-04-07T11:45:00",
                    endTime: "2025-04-07T13:15:00",
                },
            ])
        )

        const { result } = renderHook(useRoomContext, {
            wrapper: HomeParamsWrapper,
        })

        await waitFor(() => expect(result.current.data).toBeDefined())
        expect(getRoom).toHaveBeenCalled()
        expect(getScheduleData).toHaveBeenCalled()
        expect(result.current.data?.roomData).toStrictEqual({
            name: "A0.03",
            location: {
                lat: 0,
                lng: 0,
            },
        })
        expect(result.current.data?.scheduleData).toStrictEqual({
            "A0.03": [
                {
                    location: "RO",
                    room: "A0.03",
                    name: "Grundlagen der Bauphysik",
                    lecturer: "Praktikum, Prof.Dr. Johannes Aschaber",
                    relevantDegrees: "IPB-B2",
                    startTime: "2025-04-07T11:45:00",
                    endTime: "2025-04-07T13:15:00",
                },
            ],
        })
    })

    it("onMapLoad should trigger flyTo if roomData available", async () => {
        const { result } = renderHook(useRoomContext, {
            wrapper: RoomContextProvider,
        })

        act(() => {
            result.current.setRoomData({
                name: "A0.03",
                location: {
                    lat: 0,
                    lng: 0,
                },
            })
        })

        expect(campus.flyTo).not.toHaveBeenCalled()

        act(() => {
            result.current.onMapLoad?.()
        })

        expect(campus.flyTo).toHaveBeenCalled()
        expect(result.current.data?.roomData).toStrictEqual({
            name: "A0.03",
            location: {
                lat: 0,
                lng: 0,
            },
        })
    })

    it("context without provider", async () => {
        const { result } = renderHook(useRoomContext)

        const consoleSpy = vi.spyOn(console, "warn")

        result.current.setRoomData({
            name: "A0.03",
            location: { lat: 0, lng: 0 },
        })
        await result.current.setRoom("A0.03")
        result.current.setDate(new Date())
        result.current.onMapLoad?.()

        expect(consoleSpy).toHaveBeenNthCalledWith(
            3,
            "No RoomContextProvider in hierarchie"
        )
    })
})
