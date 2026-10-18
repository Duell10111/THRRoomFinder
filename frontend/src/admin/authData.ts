import { backendUrl } from "@/utils/const"

/**
 * Sends a DELETE request to remove a specific room from the backend database.
 *
 * @param accessToken - A valid JWT token with admin privileges.
 * @param roomName - The name of the room to be deleted.
 */
export async function removeRoomFromDatabase(
    accessToken: string,
    roomName: string
) {
    const response = await fetch(
        `${backendUrl}/api/v1/admin/room/${roomName}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    if (!response.ok) {
        throw new Error(`Could not delete room (HTTP ${response.status})`)
    }
}

/**
 * Sends a DELETE request to remove all rooms from the backend database.
 *
 * @param accessToken - A valid JWT token with admin privileges.
 */
export async function removeRoomsFromDatabase(accessToken: string) {
    const response = await fetch(`${backendUrl}/api/v1/admin/room`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    if (!response.ok) {
        throw new Error(`Could not delete rooms (HTTP ${response.status})`)
    }
}

/**
 * Sends a DELETE request to clear all cached room schedules on the backend.
 *
 * @param accessToken - A valid JWT token with admin privileges.
 */
export async function removeSchedulesFromCache(accessToken: string) {
    const response = await fetch(`${backendUrl}/api/v1/admin/schedules`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    if (!response.ok) {
        throw new Error(`Could not clear schedules (HTTP ${response.status})`)
    }
}
