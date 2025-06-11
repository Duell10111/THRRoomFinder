import { AuthContextProvider } from "@/admin/AuthContext"
import React from "react"
import { RoomContextProvider } from "@/context/RoomContext"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
    return (
        <AuthContextProvider>
            <RoomContextProvider>{children}</RoomContextProvider>
        </AuthContextProvider>
    )
}
