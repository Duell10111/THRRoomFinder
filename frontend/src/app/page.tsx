"use client"

import {AppShell, Autocomplete, Burger, Container, Group, Skeleton, Space} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {CampusMap} from "@/components/CampusMap";
import {MapProvider} from "react-map-gl/maplibre";
import {MapPage} from "@/sites/MapPage";

export default function Home() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  return (
      <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            {/*<MantineLogo size={30} />*/}
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          Navbar
          {Array(15)
              .fill(0)
              .map((_, index) => (
                  <Skeleton key={index} h={28} mt="sm" animate={false} />
              ))}
        </AppShell.Navbar>
        <AppShell.Main>
            <MapProvider>
                <MapPage />
            </MapProvider>
        </AppShell.Main>
      </AppShell>
  );
}
