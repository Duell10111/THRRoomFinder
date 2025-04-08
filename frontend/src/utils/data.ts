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

export interface SimpleRoomData {
    name: string;
    // TODO: Add displayName
}

export async function getScheduleData(roomName: string): Promise<ScheduleData[]> {
    const data = await fetch(`${backendUrl}/api/v1/room/${roomName}/schedule`)
    return await data.json() as ScheduleData[]
}

export async function getRoom(roomName: string) {
    const data = await fetch(`${backendUrl}/api/v1/room/${roomName}`)
    if(data.ok) {
        return await data.json() as RoomData;
    } else if(data.status === 404) {
        return undefined;
    } else {
        throw new Error("Could not find room with status code: " + data.status);
    }
}

export async function getAllRooms() {
    const data = await fetch(`${backendUrl}/api/v1/room/`)
    if(data.ok) {
        return await data.json() as SimpleRoomData[];
    } else {
        throw new Error("Could not find room with status code: " + data.status);
    }
}
