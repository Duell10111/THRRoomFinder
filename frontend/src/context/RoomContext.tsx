"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    getRoom,
    getScheduleData,
    getScheduleDataRelatedToRoom,
    RoomData,
    ScheduleData,
} from "@/utils/data"
import { useMap } from "react-map-gl/maplibre"
import { showErrorNotification } from "@/utils/notifications"

type RoomContextData = {
    roomData: RoomData
    scheduleData?: { [roomName: string]: ScheduleData[] }
    date?: Date
}

/**
 * Defines the structure of the room context available to components.
 *
 * Includes information about the selected room, associated schedule data,
 * the currently selected indoor level, and helper functions to modify this state.
 */
interface RoomContextType {
    data?: RoomContextData
    level?: string
    setRoomData: (roomData: RoomData) => void
    setRoom: (
        roomName: string,
        zoomIn?: boolean
    ) => Promise<RoomData | undefined>
    setDate: (date: Date | undefined) => void
    // Called from IndoorControls if level changed by user
    setLevel?: (level: string) => void
    // Helper Fkt called once map loaded
    onMapLoad?: () => void
}

const RoomContext = createContext<RoomContextType>({
    setRoomData: () => console.warn("No RoomContextProvider in hierarchie"),
    setRoom: async () => {
        console.warn("No RoomContextProvider in hierarchie")
        return undefined
    },
    setDate: () => console.warn("No RoomContextProvider in hierarchie"),
})

/**
 * Props for the RoomContextProvider component.
 *
 * @property homeParams - Optional async route params from the homepage (e.g., slug with room name).
 * @property children - The component subtree that will have access to the room context.
 */
interface RoomContextProviderProps {
    homeParams?: Promise<{ slug?: string[] }>
    children: React.ReactNode
}

/**
 * Provides room-related state and control functions to the component tree.
 *
 * This context handles selected room information, indoor map zoom and level control,
 * and schedule data fetching when the room changes.
 *
 * @param props - The props for RoomContextProvider including optional route slug and children.
 * @returns A context provider wrapping its children with room-related state.
 */
export function RoomContextProvider({
    homeParams,
    children,
}: Readonly<RoomContextProviderProps>) {
    const { campus } = useMap()

    const [roomData, setRoomData] = useState<RoomContextData["roomData"]>()
    const [scheduleData, setScheduleData] =
        useState<RoomContextData["scheduleData"]>()
    const [date, setDate] = useState<Date>()
    const zoomToRoom = useRef(false)
    const [level, setLevel] = useState<string>()

    const setRoom = useCallback(
        async (roomName: string, zoomIn?: boolean) => {
            const room = await getRoom(roomName)
            setRoomData(room)
            if (zoomIn && room) {
                if (campus) {
                    setLevel(getLevel(roomName))
                    campus?.flyTo({
                        center: [room.location.lng, room.location.lat],
                        zoom: 20,
                    })
                } else {
                    // If no map available, zoom to room on next map load
                    zoomToRoom.current = true
                }
            }
            return room
        },
        [campus]
    )

    useEffect(() => {
        if (roomData) {
            getScheduleData(roomData.name, date)
                .then((data) => {
                    setScheduleData((prevData) => ({
                        ...prevData,
                        [roomData.name]: data,
                    }))
                })
                .catch(console.error)
            getScheduleDataRelatedToRoom(roomData.name)
                .then((data) => {
                    setScheduleData((prevData) => ({
                        ...prevData,
                        ...data,
                    }))
                })
                .catch(console.error)
        }
    }, [roomData, date])

    useEffect(() => {
        homeParams
            ?.then((v) => (v.slug ? parseHomeSlug(v.slug) : undefined))
            ?.then(async (obj) => {
                if (obj?.room) await setRoom(obj.room)
            })
            .catch((error) => {
                console.error("Error using room from url: ", error)
                showErrorNotification({
                    title: "Error using provided room from url",
                    message: error.message,
                })
            })
    }, [homeParams, setRoom])

    const contextData: RoomContextData | undefined = useMemo(
        () =>
            roomData
                ? {
                      roomData,
                      scheduleData,
                      date,
                  }
                : undefined,
        [roomData, scheduleData, date]
    )

    return (
        <RoomContext.Provider
            value={useMemo(
                () => ({
                    data: contextData,
                    level,
                    setRoomData,
                    setRoom,
                    setDate,
                    setLevel,
                    onMapLoad: () => {
                        if (roomData) {
                            // Fly to room and set needed level
                            setLevel(getLevel(roomData.name))
                            campus?.flyTo({
                                center: [
                                    roomData.location.lng,
                                    roomData.location.lat,
                                ],
                                zoom: 20,
                            })
                            zoomToRoom.current = false
                        }
                    },
                }),
                [contextData, level, setRoom, roomData, campus]
            )}
        >
            {children}
        </RoomContext.Provider>
    )
}

/**
 * Hook for accessing the RoomContext within child components.
 *
 * @returns The current context value, including room data, schedule data, and control functions.
 */
export function useRoomContext() {
    return useContext(RoomContext)
}

/**
 * Parses a route slug array into a room and optional building identifier.
 *
 * @param slug - Array of URL path segments (e.g., ['MB', '3.43']).
 * @returns An object containing room and optionally building information.
 */
function parseHomeSlug(slug: string[]) {
    if (slug.length > 1) {
        const [building, room] = slug
        return { building, room }
    } else {
        return { room: slug?.[0] }
    }
}

/**
 * Extracts the indoor level from a room name using regex (e.g., '3.43' → '3').
 *
 * @param roomName - The name of the room.
 * @returns A string representing the level if found, otherwise undefined.
 */
function getLevel(roomName: string) {
    const match = /-?\d+/.exec(roomName)
    if (match) {
        return match[0]
    }
}
