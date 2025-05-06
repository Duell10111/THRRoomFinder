import Image from "next/image"
import Link from "next/link"
import { Title } from "@mantine/core"

export function NavLogo() {
    return (
        <>
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
        </>
    )
}
