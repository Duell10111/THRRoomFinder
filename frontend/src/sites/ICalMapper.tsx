"use client"

import { Container, Title, Text, Stack, TextInput, Button, CopyButton, Group, Alert, Card } from "@mantine/core"
import { IconCheck, IconCopy, IconAlertCircle } from "@tabler/icons-react"
import Head from "next/head"
import { useState, useMemo } from "react"

/**
 * A page component that allows users to convert an iCal link to a Base64-encoded query parameter.
 *
 * Users can paste an iCal URL, and the component generates a mapped link that can be used
 * as a replacement endpoint, with the original iCal link passed as a Base64-encoded query string.
 *
 * @returns A React functional component for iCal link mapping.
 */
export default function ICalMapper() {
    const [inputUrl, setInputUrl] = useState("")
    const [error, setError] = useState("")

    const mappedUrl = useMemo(() => {
        setError("")

        if (!inputUrl.trim()) {
            return ""
        }

        try {
            // Validate URL format
            new URL(inputUrl)

            // Encode the URL to Base64
            const encoded = Buffer.from(inputUrl).toString("base64")

            // Get the current origin
            const origin = typeof window !== "undefined" ? window.location.origin : ""

            // Create the mapped URL
            return `${origin}/api/ical/?iCalUrl=${encoded}`
        } catch (err) {
            console.error("Error during url mapping:", err)
            setError("Ungültige URL. Bitte geben Sie eine gültige iCal URL ein.")
            return ""
        }
    }, [inputUrl])

    return (
        <>
            <Head>
                <title>iCal Mapper - THRRoomfinder</title>
                <meta name="description" content="Konvertiere iCal Links in eine Base64-codierte URL" />
            </Head>

            <Container size="sm" py="xl">
                <Stack gap="lg">
                    <Title order={1}>SPlan iCal Location Mapper</Title>

                    <Text>
                        Geben Sie ihren persönlichen iCal Link ein aus dem SPlan ein und der Mapper konvertiert ihn
                        zu einen iCal Link der die Informationen mit Standortdaten bereichert.
                    </Text>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} mb="xs">
                                    iCal URL eingeben
                                </Text>
                                <TextInput
                                    placeholder="https://splan.fh-rosenheim.de/splan/ical"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.currentTarget.value)}
                                    error={error ? true : false}
                                    description={
                                        error ? error : "Fügen Sie hier die iCal URL ein"
                                    }
                                />
                            </div>

                            {mappedUrl && (
                                <div>
                                    <Text size="sm" fw={500} mb="xs">
                                        Abgeleiteter Link
                                    </Text>
                                    <Group gap="xs">
                                        <TextInput
                                            readOnly
                                            value={mappedUrl}
                                            flex={1}
                                            style={{
                                                wordBreak: "break-all",
                                            }}
                                        />
                                        <CopyButton value={mappedUrl} timeout={2000}>
                                            {({ copied }) => (
                                                <Button
                                                    color={copied ? "teal" : "blue"}
                                                    leftSection={
                                                        copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                                                    }
                                                >
                                                    {copied ? "Kopiert" : "Kopieren"}
                                                </Button>
                                            )}
                                        </CopyButton>
                                    </Group>
                                    <Text size="xs" c="dimmed" mt="xs">
                                        Dieser Link kann als Ersatz für den ursprünglichen
                                        iCal Link verwendet werden.
                                    </Text>
                                </div>
                            )}
                        </Stack>
                    </Card>

                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Hinweis"
                        color="blue"
                    >
                        Die ursprüngliche URL wird Base64-codiert und als
                        Abfrageparameter übergeben. Diese wird vom Backend dekodiert
                        und der iCal Feed abgerufen.
                    </Alert>
                </Stack>
            </Container>
        </>
    )
}
