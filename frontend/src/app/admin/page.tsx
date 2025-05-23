"use client"

import { Card, SimpleGrid, Title } from "@mantine/core"
import { useAuthContext } from "@/admin/AuthContext"
import { redirect } from "next/navigation"
import { DangerButton } from "@/components/admin/DangerButton"
import { removeRoomsFromDatabase } from "@/admin/authData"
import { RoomButton } from "@/components/admin/RoomButton"

export default function AdminDashboard() {
    const { user } = useAuthContext()

    // Redirect to login if user is not logged in
    if (user === null) {
        return redirect("/admin/login")
    }

    return (
        <SimpleGrid cols={2}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4}>Cache Actions</Title>

                <DangerButton
                    label={"Clear all schedule cache data"}
                    mt="md"
                    radius="md"
                    action={async (token) => {
                        await removeRoomsFromDatabase(token)
                    }}
                />
            </Card>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb={"md"}>
                    Room Actions
                </Title>

                <RoomButton color="blue" mt="md" radius="md" />
                <DangerButton
                    label={"Clear all rooms"}
                    mt="md"
                    radius="md"
                    action={async (token) => {
                        await removeRoomsFromDatabase(token)
                    }}
                />
            </Card>
        </SimpleGrid>
    )
}
