"use client"

import { AppShell, CloseButton, Group } from "@mantine/core"
import Link from "next/link"
import React from "react"
import { NavLogo } from "@/navigation/NavLogo"

interface NavAppShellSubPagesProps {
    children: React.ReactNode
}

export function NavAppShellSubPages({
    children,
}: Readonly<NavAppShellSubPagesProps>) {
    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Group h={"100%"} px="md">
                    <Link href="/">
                        <CloseButton />
                    </Link>
                    <NavLogo />
                </Group>
            </AppShell.Header>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    )
}
