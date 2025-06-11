import useAdminAction, { AdminActionFkt } from "@/admin/useAdminAction"
import { AutocompleteSubmit } from "@/components/AutocompleteSubmit"
import { useState } from "react"
import { Button, ButtonProps } from "@mantine/core"
import { removeRoomFromDatabase } from "@/admin/authData"
import {
    showErrorNotification,
    showSuccessNotification,
} from "@/utils/notifications"

export interface RoomButtonProps extends ButtonProps {
    action?: AdminActionFkt
}

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
