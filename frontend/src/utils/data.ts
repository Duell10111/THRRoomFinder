import { backendUrl } from "@/utils/const"
import dayjs from "dayjs"

export interface ScheduleData {
    location: "RO"
    room: string
    name: string
    lecturer: string
    relevantDegrees: string
    startTime: string
    endTime: string
}

export interface RoomData {
    name: string
    location: {
        lat: number
        lng: number
    }
}

export interface ExtendedRoomData extends RoomData {
    buildingName?: string
}

export interface SimpleRoomData {
    name: string
    displayName?: string
}

export async function getScheduleData(
    roomName: string,
    date?: Date
): Promise<ScheduleData[]> {
    const dateUrl = date ? `/${dayjs(date).format("YYYY-MM-DD")}` : ""

    const data = await fetch(
        `${backendUrl}/api/v1/room/${roomName}/schedule${dateUrl}`
    )
    return (await data.json()) as ScheduleData[]
}

export async function getRoom(roomName: string) {
    const data = await fetch(`${backendUrl}/api/v1/room/${roomName}`)
    if (data.ok) {
        return (await data.json()) as RoomData
    } else if (data.status === 404) {
        return undefined
    } else {
        throw new Error("Could not find room with status code: " + data.status)
    }
}

export async function getAllRooms() {
    const data = await fetch(`${backendUrl}/api/v1/room/`)
    if (data.ok) {
        return (await data.json()) as SimpleRoomData[]
    } else {
        throw new Error(
            "Could not fetch all rooms with status code: " + data.status
        )
    }
}

export async function getAllRoomsWithBuildings() {
    const data = await fetch(`${backendUrl}/api/v1/room/extended`)
    if (data.ok) {
        return (await data.json()) as ExtendedRoomData[]
    } else {
        throw new Error(
            "Could not fetch all rooms with status code: " + data.status
        )
    }
}
