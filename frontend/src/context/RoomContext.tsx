import React, { createContext, useContext, useEffect, useState } from "react"
import { getScheduleData, RoomData, ScheduleData } from "@/utils/data"

type RoomContextData = {
    roomData: RoomData
    scheduleData?: ScheduleData[]
    date?: Date
}

interface RoomContextType {
    data?: RoomContextData
    setRoomData: (roomData: RoomData) => void
    setDate: (date: Date | undefined) => void
}

const RoomContext = createContext<RoomContextType>({
    setRoomData: () => console.warn("No RoomContextProvider in hierarchie"),
    setDate: () => console.warn("No RoomContextProvider in hierarchie"),
})

interface RoomContextProviderProps {
    children: React.ReactNode
}

export function RoomContextProvider({ children }: RoomContextProviderProps) {
    const [roomData, setRoomData] = useState<RoomContextData["roomData"]>()
    const [scheduleData, setScheduleData] =
        useState<RoomContextData["scheduleData"]>()
    const [date, setDate] = useState<Date>()

    useEffect(() => {
        if (roomData) {
            getScheduleData(roomData.name, date)
                .then(setScheduleData)
                .catch(console.error)
        }
    }, [roomData, date])

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
                setDate,
            }}
        >
            {children}
        </RoomContext.Provider>
    )
}

export function useRoomContext() {
    return useContext(RoomContext)
}
