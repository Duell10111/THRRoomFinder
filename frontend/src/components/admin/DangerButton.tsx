"use client"

import useAdminAction, { AdminActionFkt } from "@/admin/useAdminAction"
import { Button, ButtonProps } from "@mantine/core"
import { useState } from "react"

/**
 * Props for the DangerButton component.
 *
 * @property label - The text displayed on the button.
 * @property action - The admin action function to be executed when confirmed.
 * @property color - Optional button color override (default is red).
 */
export interface DangerButtonProps extends ButtonProps {
    label: string
    action: AdminActionFkt
}

/**
 * A button component that performs a potentially dangerous admin action.
 *
 * The button requires a confirmation click before executing the action.
 * On first click, it prompts with "Are you sure?". On second click, it executes the provided action.
 * Uses a faded red color on confirmation for visual emphasis.
 *
 * @param props - Component props including label, action, and optional Mantine Button props.
 * @returns A React button component with confirmation logic for critical actions.
 */
export function DangerButton({
    label,
    action,
    color,
    ...props
}: Readonly<DangerButtonProps>) {
    const { actionFkt, loading } = useAdminAction(action)
    const [confirm, setConfirm] = useState(false)

    return (
        <Button
            loading={loading}
            color={confirm ? "rgba(132,17,17,0.65)" : (color ?? "red")}
            {...props}
            onClick={() => {
                if (confirm) {
                    actionFkt()
                        .catch(console.error)
                        .finally(() => {
                            setConfirm(false)
                        })
                } else {
                    setConfirm(true)
                }
            }}
        >
            {confirm ? "Are you sure?" : label}
        </Button>
    )
}
