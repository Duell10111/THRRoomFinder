"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { onAuthStateChanged, User } from "@firebase/auth"
import { auth } from "@/admin/auth"

/**
 * Represents the structure of the authentication context.
 *
 * @property user - The currently authenticated Firebase user or null if not authenticated.
 */
interface AuthContextType {
    user?: User | null
}

/**
 * Props for the AuthContextProvider component.
 *
 * @property children - React children to be rendered within the context provider.
 */
interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextType>({})

/**
 * Provides authentication context to child components by listening to Firebase auth state changes.
 *
 * Wrap this provider around components that need access to the current user.
 *
 * @param props - Props containing the React children elements.
 * @returns A context provider component for authentication state.
 */
export function AuthContextProvider({
    children,
}: Readonly<AuthContextProviderProps>) {
    const [user, setUser] = useState<User | null>()

    useEffect(() => {
        const sub = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
        return () => sub()
    }, [])

    const contextValue = useMemo(() => ({ user }), [user])

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Custom hook to access the authentication context.
 *
 * @returns The current authentication context containing the user object.
 */
export function useAuthContext() {
    return useContext(AuthContext)
}
