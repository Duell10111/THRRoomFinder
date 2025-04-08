import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import {getScheduleData, RoomData, ScheduleData} from "@/utils/data";

type RoomContextData = {
    roomData: RoomData
    scheduleData?: ScheduleData[];
}

interface RoomContextType {
    data?: RoomContextData;
    setRoomData: (roomData: RoomData) => void;
}

const RoomContext = createContext<RoomContextType>({
    setRoomData: () => console.warn("No RoomContextProvider in hierarchie")
});

interface RoomContextProviderProps {
    children: React.ReactNode;
}

export function RoomContextProvider({children}: RoomContextProviderProps) {
    const [roomData, setRoomData] = useState<RoomContextData["roomData"]>();
    const [scheduleData, setScheduleData] = useState<RoomContextData["scheduleData"]>();

    console.log("Room Context data: ", roomData)

    useEffect(() => {
        if(roomData) {
            getScheduleData(roomData.name).then(setScheduleData).catch(console.error);
        }
    }, [roomData]);

    const contextData : RoomContextData | undefined = roomData ? {
        roomData,
        scheduleData,
    } : undefined

    return (
        <RoomContext.Provider value={{
            data: contextData,
            setRoomData,
        }} >
            {children}
        </RoomContext.Provider>
    );
}

export function useRoomContext() {
    return useContext(RoomContext);
}
