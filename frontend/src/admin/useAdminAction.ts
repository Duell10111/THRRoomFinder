import { useState } from "react"
import { useAuthContext } from "@/admin/AuthContext"

/**
 * Type definition for an admin action function that requires a Firebase ID token.
 *
 * @param token - A valid Firebase authentication token.
 * @returns A Promise that resolves once the action is complete.
 */
export type AdminActionFkt = (token: string) => Promise<void>

/**
 * React hook that wraps an admin action requiring Firebase authentication.
 *
 * Handles loading and error states while retrieving the user's ID token and invoking the action.
 *
 * @param actionFkt - A function that performs an admin action using an ID token.
 * @returns An object containing:
 *   - loading: Whether the action is in progress.
 *   - error: Any error that occurred during the action.
 *   - actionFkt: A wrapped function to execute the admin action.
 */
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
