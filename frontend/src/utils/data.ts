import {backendUrl} from "@/utils/const";

export interface ScheduleData {
    location: "RO",
    room: string;
    name: string;
    lecturer: string;
    relevantDegrees: string;
    startTime: string;
    endTime: string;
}

export interface RoomData {
    name: string;
    location: {
        lat: number;
        lng: number;
    };
}

export async function getScheduleData(roomName: string): Promise<ScheduleData[]> {
    const data = await fetch(`${backendUrl}/api/v1/room/${roomName}/schedule`)
    return await data.json() as ScheduleData[]
}
