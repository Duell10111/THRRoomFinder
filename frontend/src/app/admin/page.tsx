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
import {
    showErrorNotification,
    showSuccessNotification,
} from "@/utils/notifications"

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
                        try {
                            await removeSchedulesFromCache(token)
                            showSuccessNotification({
                                title: "Cleared schedules",
                                message: "All schedules deleted from cache",
                            })
                        } catch (ex) {
                            showErrorNotification({
                                title: "Cleared schedules",
                                message:
                                    // @ts-expect-error Ignore unknown type for error exception
                                    ex.message ??
                                    "Unknown error, try again later",
                            })
                        }
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
                        try {
                            await removeRoomsFromDatabase(token)
                            showSuccessNotification({
                                title: "Cleared rooms",
                                message: "All rooms deleted from database",
                            })
                        } catch (ex) {
                            showErrorNotification({
                                title: "Error clearing rooms",
                                message:
                                    // @ts-expect-error Ignore unknown type for error exception
                                    ex.message ??
                                    "Unknown error, try again later",
                            })
                        }
                    }}
                    data-testid={"clear-room-data"}
                />
            </Card>
        </SimpleGrid>
    )
}
