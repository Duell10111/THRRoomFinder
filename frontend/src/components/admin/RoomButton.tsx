import useAdminAction, { AdminActionFkt } from "@/admin/useAdminAction"
import { AutocompleteSubmit } from "@/components/AutocompleteSubmit"
import { useState } from "react"
import { Button, ButtonProps } from "@mantine/core"
import { removeRoomFromDatabase } from "@/admin/authData"
import {
    showErrorNotification,
    showSuccessNotification,
} from "@/utils/notifications"

/**
 * Props for the RoomButton component.
 *
 * @property action - Optional custom admin action function (not used in current implementation).
 * @extends ButtonProps - Inherits all standard Mantine ButtonProps.
 */
export interface RoomButtonProps extends ButtonProps {
    action?: AdminActionFkt
}

/**
 * A component that allows an admin to select and delete a room from the database.
 *
 * Includes an autocomplete input to select a room name and a button to confirm deletion.
 * Uses Firebase authentication and displays success/error notifications based on the result.
 *
 * @param props - Optional Mantine button props and a placeholder for a custom action function.
 * @returns A UI element with autocomplete and button for room deletion.
 */
export function RoomButton(props: Readonly<RoomButtonProps>) {
    const [room, setRoom] = useState<string>()
    const { loading, actionFkt } = useAdminAction(async (token) => {
        if (room) {
            await removeRoomFromDatabase(token, room)
        }
    })

    return (
        <>
            <AutocompleteSubmit onSubmit={setRoom} placeholder="Pick room" />
            <Button
                onClick={() => {
                    actionFkt()
                        .then(() =>
                            showSuccessNotification({
                                title: "Deleted room",
                                message: "Deleted room from database",
                            })
                        )
                        .catch((e) => {
                            console.error(e)
                            showErrorNotification({
                                title: "Error deleting room",
                                message: e.message,
                            })
                        })
                }}
                loading={loading}
                {...props}
            >
                Delete Room
            </Button>
        </>
    )
}
