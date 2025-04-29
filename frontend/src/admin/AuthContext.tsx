"use client"

import React, { createContext, useContext, useState } from "react"
import { onAuthStateChanged, User } from "@firebase/auth"
import { auth } from "@/admin/auth"

interface AuthContextType {
    user?: User | null
}

const AuthContext = createContext<AuthContextType>({})

interface AuthContextProviderProps {
    children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<User | null>()
    onAuthStateChanged(auth, (user) => {
        setUser(user)
    })

    return (
        <AuthContext.Provider
            value={{
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)
}
