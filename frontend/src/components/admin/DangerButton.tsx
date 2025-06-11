"use client"

import useAdminAction, { AdminActionFkt } from "@/admin/useAdminAction"
import { Button, ButtonProps } from "@mantine/core"
import { useState } from "react"

export interface DangerButtonProps extends ButtonProps {
    label: string
    action: AdminActionFkt
}

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
