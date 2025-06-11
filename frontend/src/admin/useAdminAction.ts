import { useState } from "react"
import { useAuthContext } from "@/admin/AuthContext"

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
            setError(e)
            setLoading(false)
            throw e
        }
        setLoading(false)
    }

    return {
        loading,
        error,
        actionFkt: adminActionFkt,
    }
}
