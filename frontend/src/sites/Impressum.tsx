import { Container, Title, Text, Stack } from "@mantine/core"
import Head from "next/head"

/**
 * A static page component that renders the legal disclosure (Impressum) for the website.
 *
 * Includes contact information, address, and a liability disclaimer for external links.
 *
 * @returns A React functional component displaying legal information about the site operator.
 */
export default function Impressum() {
    return (
        <>
            <Head>
                <title>Impressum - THRRoomfinder</title>
                <meta name="description" content="Impressum der Website" />
            </Head>

            <Container size="sm" mt="xl">
                <Stack>
                    <Title order={1}>Impressum</Title>

                    <Text>Angaben gemäß § 5 DDG:</Text>
                    <Text>
                        Max Mustermann <br />
                        Musterstraße 123 <br />
                        12345 Musterstadt
                    </Text>

                    <Text>Kontakt:</Text>
                    <Text>E-Mail: admin@duell10111.de</Text>

                    <Title order={4}>Haftung für Links</Title>
                    <Text>
                        Unser Angebot enthält Links zu externen Webseiten
                        Dritter, auf deren Inhalte wir keinen Einfluss haben.
                        Deshalb können wir für diese fremden Inhalte auch keine
                        Gewähr übernehmen. Für die Inhalte der verlinkten Seiten
                        ist stets der jeweilige Anbieter oder Betreiber der
                        Seiten verantwortlich. Die verlinkten Seiten wurden zum
                        Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                        überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                        Verlinkung nicht erkennbar. Eine permanente inhaltliche
                        Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                        Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                        Bekanntwerden von Rechtsverletzungen werden wir
                        derartige Links umgehend entfernen.
                    </Text>
                </Stack>
            </Container>
        </>
    )
}
