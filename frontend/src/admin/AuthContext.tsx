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

interface AuthContextType {
    user?: User | null
}

const AuthContext = createContext<AuthContextType>({})

interface AuthContextProviderProps {
    children: React.ReactNode
}

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

export function useAuthContext() {
    return useContext(AuthContext)
}
