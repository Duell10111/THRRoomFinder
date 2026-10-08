"use client"

import {
    createTheme,
    MantineProvider,
    v8CssVariablesResolver,
} from "@mantine/core"
import { ReactNode } from "react"

// Keep the Mantine 8 look (default radius and light variant colors) after the upgrade to Mantine 9
const theme = createTheme({
    defaultRadius: "sm",
})

export function AppMantineProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <MantineProvider
            theme={theme}
            cssVariablesResolver={v8CssVariablesResolver}
            defaultColorScheme="dark"
        >
            {children}
        </MantineProvider>
    )
}
