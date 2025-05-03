"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { getRoom, getScheduleData, RoomData, ScheduleData } from "@/utils/data"
import { useMap } from "react-map-gl/maplibre"

type RoomContextData = {
    roomData: RoomData
    scheduleData?: ScheduleData[]
    date?: Date
}

interface RoomContextType {
    data?: RoomContextData
    setRoomData: (roomData: RoomData) => void
    setRoom: (
        roomName: string,
        zoomIn?: boolean
    ) => Promise<RoomData | undefined>
    setDate: (date: Date | undefined) => void
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

interface RoomContextProviderProps {
    homeParams?: Promise<{ slug?: string[] }>
    children: React.ReactNode
}

export function RoomContextProvider({
    homeParams,
    children,
}: RoomContextProviderProps) {
    const { campus } = useMap()

    const [roomData, setRoomData] = useState<RoomContextData["roomData"]>()
    const [scheduleData, setScheduleData] =
        useState<RoomContextData["scheduleData"]>()
    const [date, setDate] = useState<Date>()
    const zoomToRoom = useRef(false)

    const setRoom = useCallback(
        async (roomName: string, zoomIn?: boolean) => {
            const room = await getRoom(roomName)
            setRoomData(room)
            if (zoomIn && room) {
                if (campus) {
                    // TODO: Update level of room to display right level of room
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
                .then(setScheduleData)
                .catch(console.error)
        }
    }, [roomData, date])

    useEffect(() => {
        homeParams
            ?.then((v) => (v.slug ? parseHomeSlug(v.slug) : undefined))
            ?.then(async (obj) => {
                if (obj?.room) await setRoom(obj.room)
            })
    }, [homeParams, setRoom])

    const contextData: RoomContextData | undefined = roomData
        ? {
              roomData,
              scheduleData,
              date,
          }
        : undefined

    return (
        <RoomContext.Provider
            value={{
                data: contextData,
                setRoomData,
                setRoom,
                setDate,
                onMapLoad: () => {
                    console.log("Map loaded")
                    if (roomData) {
                        console.log("Fly to room")
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
            }}
        >
            {children}
        </RoomContext.Provider>
    )
}

export function useRoomContext() {
    return useContext(RoomContext)
}

function parseHomeSlug(slug: string[]) {
    if (slug.length > 1) {
        const [building, room] = slug
        return { building, room }
    } else {
        return { room: slug?.[0] }
    }
}
