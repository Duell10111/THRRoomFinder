import { NotificationData, notifications } from "@mantine/notifications"

export function showSuccessNotification(notificationData: NotificationData) {
    notifications.show({
        ...notificationData,
        color: "green",
        autoClose: 1000,
    })
}

export function showErrorNotification(notificationData: NotificationData) {
    notifications.show({
        ...notificationData,
        color: "red",
    })
}
