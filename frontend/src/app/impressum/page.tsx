"use client"

import { AppShell, CloseButton, Group } from "@mantine/core"
import Link from "next/link"
import Impressum from "@/sites/Impressum"

export default function ImpressumPage() {
    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Group h={"100%"} px="md">
                    <Link href="/">
                        <CloseButton />
                    </Link>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Impressum />
            </AppShell.Main>
        </AppShell>
    )
}
