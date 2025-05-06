"use client"

import { useDisclosure } from "@mantine/hooks"
import { useRoomContext } from "@/context/RoomContext"
import React, { useEffect } from "react"
import { AppShell, Burger, Group, NavLink } from "@mantine/core"
import { ScheduleDatePicker } from "@/components/schedule/ScheduleDatePicker"
import { RoomDetails } from "@/sites/RoomDetails"
import { ReportIssuePopupNavBarItem } from "@/components/ReportIssuePopup"
import { IconScale, IconUsers, IconBrandGithub } from "@tabler/icons-react"
import { NavLogo } from "@/navigation/NavLogo"

interface NavAppShellProps {
    children: React.ReactNode
}

export function NavAppShell({ children }: NavAppShellProps) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop, open: openDesktop }] =
        useDisclosure(true)

    const { data } = useRoomContext()

    useEffect(() => {
        if (data?.scheduleData) {
            openDesktop()
        }
    }, [data?.scheduleData, openDesktop])

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: {
                    mobile: !mobileOpened,
                    desktop: !desktopOpened,
                },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger
                        opened={mobileOpened}
                        onClick={toggleMobile}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Burger
                        opened={desktopOpened}
                        onClick={toggleDesktop}
                        visibleFrom="sm"
                        size="sm"
                    />
                    <NavLogo />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="xd">
                <AppShell.Section>
                    <ScheduleDatePicker />
                </AppShell.Section>
                <RoomDetails />
                <AppShell.Section>
                    <ReportIssuePopupNavBarItem />
                    <NavLink
                        href="https://github.com/Duell10111/THRRoomFinder"
                        label={"Github"}
                        leftSection={<IconBrandGithub size={16} stroke={1.5} />}
                        target="_blank"
                    />
                    <NavLink
                        href="/credits"
                        label={"Credits"}
                        leftSection={<IconUsers size={16} stroke={1.5} />}
                    />
                    <NavLink
                        href="/impressum"
                        label="Impressum"
                        leftSection={<IconScale size={16} stroke={1.5} />}
                    />
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    )
}
