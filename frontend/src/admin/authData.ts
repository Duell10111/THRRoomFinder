import { backendUrl } from "@/utils/const"

export async function removeRoomFromDatabase(
    accessToken: string,
    roomName: string
) {
    await fetch(`${backendUrl}/api/v1/admin/room/${roomName}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function removeRoomsFromDatabase(accessToken: string) {
    await fetch(`${backendUrl}/api/v1/admin/room/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function removeSchedulesFromCache(accessToken: string) {
    await fetch(`${backendUrl}/api/v1/admin/schedules`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}
