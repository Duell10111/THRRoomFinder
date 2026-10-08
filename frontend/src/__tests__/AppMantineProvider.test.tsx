import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "@mantine/core"
import { AppMantineProvider } from "@/app/AppMantineProvider"

function getMantineCss() {
    return Array.from(document.querySelectorAll("style"))
        .map((style) => style.textContent ?? "")
        .join("\n")
}

test("AppMantineProvider renders children", () => {
    render(
        <AppMantineProvider>
            <Button>Test Button</Button>
        </AppMantineProvider>
    )

    expect(screen.getByRole("button", { name: "Test Button" })).toBeDefined()
})

test("AppMantineProvider keeps Mantine 8 radius and light colors", () => {
    render(
        <AppMantineProvider>
            <div />
        </AppMantineProvider>
    )

    const css = getMantineCss()
    // Default radius "sm" instead of Mantine 9 default "md"
    expect(css).toContain(
        "--mantine-radius-default: calc(0.25rem * var(--mantine-scale))"
    )
    // Transparent light variant colors instead of Mantine 9 solid colors
    expect(css).toMatch(
        /--mantine-color-blue-light: rgba\(34, 139, 230, 0\.1\)/
    )
})
