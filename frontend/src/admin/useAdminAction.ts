import { useState } from "react"
import { useAuthContext } from "@/admin/AuthContext"
import { notifications } from "@mantine/notifications"

export type AdminActionFkt = (token: string) => Promise<void>

export default function useAdminAction(actionFkt: AdminActionFkt) {
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>()

    const adminActionFkt = async () => {
        setLoading(true)
        try {
            const token = await user!.getIdToken()
            await actionFkt(token)
        } catch (e) {
            console.error(e)
            setError(e)
            notifications.show({
                color: "red",
                title: "Error happened during API call",
                message: error as string,
            })
        }
        setLoading(false)
    }

    return {
        loading,
        error,
        actionFkt: adminActionFkt,
    }
}
