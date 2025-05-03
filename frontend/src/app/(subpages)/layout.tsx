import { ReactNode } from "react"
import { NavAppShellSubPages } from "@/navigation/NavAppShellSubPages"

export default function Layout({ children }: { children: ReactNode }) {
    return <NavAppShellSubPages>{children}</NavAppShellSubPages>
}
