import { useDisclosure } from "@mantine/hooks"
import { AppShell, Burger, Group, NavLink, Title } from "@mantine/core"
import { RoomDetails } from "@/sites/RoomDetails"
import { MapProvider } from "react-map-gl/maplibre"
import { MapPage } from "@/sites/MapPage"
import { useRoomContext } from "@/context/RoomContext"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ScheduleDatePicker } from "@/components/schedule/ScheduleDatePicker"

export function HomeAppShell() {
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
                    <Image
                        src="/icon-without-text-cut.png"
                        alt="Roomfinder Logo"
                        width={45}
                        height={45}
                        priority
                        style={{ borderRadius: 10 }}
                    />
                    <Link href={"/"}>
                        <Title order={2} c={"orange"}>
                            THRRoomfinder
                        </Title>
                    </Link>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="xd">
                <AppShell.Section>
                    <ScheduleDatePicker />
                </AppShell.Section>
                <RoomDetails />
                <AppShell.Section>
                    <NavLink href="/impressum" label="Impressum" />
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
                <MapPage />
            </AppShell.Main>
        </AppShell>
    )
}
