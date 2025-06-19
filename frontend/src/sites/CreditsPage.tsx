import {
    ActionIcon,
    Card,
    Container,
    SimpleGrid,
    Text,
    Title,
} from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import contributors from "../../contributors.json"
import Link from "next/link"
import packageJSON from "../../package.json"

type Contributor = {
    name: string
    role: string
    github?: string
}

export function CreditsPage() {
    return (
        <Container size="lg" py="xl">
            <Title order={2}>Our contributors</Title>
            <Title order={6} mb="lg">
                Version {packageJSON.version}
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="xl">
                {contributors.map((person: Contributor, index) => (
                    <Card
                        key={person.name + index}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                    >
                        <Text size="lg">{person.name}</Text>
                        <Text c={"dimmed"} size={"sm"}>
                            {person.role}
                        </Text>
                        {person.github && (
                            <SimpleGrid cols={3} mt={"md"}>
                                {person.github ? (
                                    <Link
                                        href={`https://github.com/${person.github}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <ActionIcon variant="filled" size="lg">
                                            <IconBrandGithub
                                                style={{
                                                    width: "70%",
                                                    height: "70%",
                                                }}
                                                stroke={1.5}
                                            />
                                        </ActionIcon>
                                    </Link>
                                ) : null}
                            </SimpleGrid>
                        )}
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    )
}
