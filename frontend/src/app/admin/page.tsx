"use client"

import { Card, Loader, SimpleGrid, Title } from "@mantine/core"
import { useAuthContext } from "@/admin/AuthContext"
import { redirect } from "next/navigation"
import { DangerButton } from "@/components/admin/DangerButton"
import {
    removeRoomsFromDatabase,
    removeSchedulesFromCache,
} from "@/admin/authData"
import { RoomButton } from "@/components/admin/RoomButton"
import { showSuccessNotification } from "@/utils/notifications"

export default function AdminDashboard() {
    const { user } = useAuthContext()

    if (user === undefined) {
        return <Loader data-testid={"loader"} />
    }

    // Redirect to login page if user is not logged in
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
                        await removeSchedulesFromCache(token)
                        showSuccessNotification({
                            title: "Cleared schedules",
                            message: "All schedules deleted from cache",
                        })
                    }}
                    data-testid={"clear-schedule-data"}
                />
            </Card>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb={"md"}>
                    Room Actions
                </Title>

                <RoomButton
                    color="blue"
                    mt="md"
                    radius="md"
                    // Test ID of submit button
                    data-testid={"clear-specific-room-data-btn"}
                />
                <DangerButton
                    label={"Clear all rooms"}
                    mt="md"
                    radius="md"
                    action={async (token) => {
                        await removeRoomsFromDatabase(token)
                        showSuccessNotification({
                            title: "Cleared rooms",
                            message: "All rooms deleted from database",
                        })
                    }}
                    data-testid={"clear-room-data"}
                />
            </Card>
        </SimpleGrid>
    )
}
