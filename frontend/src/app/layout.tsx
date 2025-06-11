import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import {
    ColorSchemeScript,
    mantineHtmlProps,
    MantineProvider,
} from "@mantine/core"
import { ReactNode } from "react"

import "./globals.css"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import { Notifications } from "@mantine/notifications"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "THRRoomfinder",
    description: "Roomfinder for the TH Rosenheim",
    icons: {
        icon: "/roomfinder-favicon-rounded-32x32.png",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <MantineProvider defaultColorScheme="dark">
                    <Notifications limit={5} />
                    {children}
                </MantineProvider>
            </body>
        </html>
    )
}
