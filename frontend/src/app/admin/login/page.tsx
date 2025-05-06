"use client"

import { FormEventHandler, useState } from "react"
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
    Group,
    Center,
} from "@mantine/core"
import { useRouter } from "next/navigation"
import { auth } from "@/admin/auth"
import { signInWithEmailAndPassword } from "@firebase/auth"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = (
        e: Parameters<FormEventHandler<HTMLFormElement>>[0]
    ) => {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("Login successful")
                router.push("/admin")
            })
            .catch((error) => {
                setError(error.message)
            })
    }

    return (
        <Container size={420} my={40}>
            <Center>
                <Title>Welcome back!</Title>
            </Center>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.currentTarget.value)
                        }
                        required
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.currentTarget.value)
                        }
                        required
                        mt="md"
                        error={error}
                    />

                    <Group mt="lg">
                        <Button fullWidth type="submit">
                            Login
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    )
}
