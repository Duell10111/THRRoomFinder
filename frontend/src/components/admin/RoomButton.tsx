import useAdminAction, { AdminActionFkt } from "@/admin/useAdminAction"
import { AutocompleteSubmit } from "@/components/AutocompleteSubmit"
import { useState } from "react"
import { Button, ButtonProps } from "@mantine/core"
import { removeRoomFromDatabase } from "@/admin/authData"

export interface RoomButtonProps extends ButtonProps {
    action?: AdminActionFkt
}

export function RoomButton(props: RoomButtonProps) {
    const [room, setRoom] = useState<string>()
    const { loading, actionFkt } = useAdminAction(async (token) => {
        if (room) {
            await removeRoomFromDatabase(token, room)
        }
    })

    return (
        <>
            <AutocompleteSubmit onSubmit={setRoom} placeholder="Pick room" />
            <Button onClick={actionFkt} loading={loading} {...props}>
                Delete Room
            </Button>
        </>
    )
}
