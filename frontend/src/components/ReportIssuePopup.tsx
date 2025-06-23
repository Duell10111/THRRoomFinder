import { useDisclosure } from "@mantine/hooks"
import { Anchor, Center, Modal, NavLink, Text } from "@mantine/core"
import { IconExclamationCircleFilled } from "@tabler/icons-react"

/**
 * A navigation bar item that displays a modal popup allowing users to report issues with map data.
 *
 * When clicked, a modal explains how users can update indoor data on OpenStreetMap.
 * Includes a direct link to OSMInEdit as a recommended editing tool.
 *
 * @returns A React component that renders the navigation link and modal popup.
 */
export function ReportIssuePopupNavBarItem() {
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                size={"lg"}
                title={
                    <Center inline>
                        <IconExclamationCircleFilled
                            size={40}
                            style={{ marginRight: 8 }}
                        />
                        <Text size="xl" fw={500}>
                            Found Issue?
                        </Text>
                    </Center>
                }
                centered
            >
                <Text ta="center">
                    If you found a issue with the map data you can update <br />
                    the indoor data on Open Street Map.
                    <br />
                    An online tool to update indoor data I recommend is{" "}
                    <Anchor
                        href="https://osminedit.pavie.info/#20/47.86759/12.10739/0"
                        target="_blank"
                        underline="hover"
                        c="blue"
                    >
                        OSMInEdit
                    </Anchor>
                    .<br /> Alternatively you can use any OSM editor of your
                    choice.
                </Text>
            </Modal>
            <NavLink
                onClick={open}
                label={"Found issue on map data"}
                leftSection={
                    <IconExclamationCircleFilled size={16} stroke={1.5} />
                }
                data-testid={"nav-link-report-issue-popup-nav-bar-item"}
            />
        </>
    )
}
