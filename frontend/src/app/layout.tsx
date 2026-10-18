import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core"
import { ReactNode } from "react"

import "./globals.css"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import { Notifications } from "@mantine/notifications"
import { AppMantineProvider } from "@/app/AppMantineProvider"

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
                {process.env.NEXT_PUBLIC_TEST_ENV === "true" && (
                    // Keep Cypress's injected script from changing the React tree.
                    // https://docs.cypress.io/app/references/error-messages#React-Hydration-Errors
                    <script
                        data-cy-bootstrap
                        suppressHydrationWarning
                        dangerouslySetInnerHTML={{
                            __html: "/* Cypress bootstrap */",
                        }}
                    />
                )}
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AppMantineProvider>
                    <Notifications limit={5} pauseResetOnHover="notification" />
                    {children}
                </AppMantineProvider>
            </body>
        </html>
    )
}
