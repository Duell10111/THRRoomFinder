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

type Contributor = {
    name: string
    role: string
    github?: string
}

export function CreditsPage() {
    return (
        <Container size="lg" py="xl">
            <Title order={2} mb="lg">
                Our contributors
            </Title>
            <SimpleGrid cols={4}>
                {contributors.map((person: Contributor, index) => (
                    <Card
                        key={index}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                    >
                        {/*<Card.Section>*/}
                        {/*    <Image*/}
                        {/*        src={person.avatar}*/}
                        {/*        height={160}*/}
                        {/*        alt={person.name}*/}
                        {/*    />*/}
                        {/*</Card.Section>*/}

                        <Text
                            size="lg"
                            // mt="md"
                        >
                            {person.name}
                        </Text>
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
