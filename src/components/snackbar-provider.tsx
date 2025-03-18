"use client";
import { notifications } from "@mantine/notifications";
import { ReactNode } from "react";
type NotificationVariant = "success" | "error" | "info" | "warning";
interface ShowNotificationProps {
  message: ReactNode;
  variant?: NotificationVariant;
  autoHideDuration?: number;
  title?: string;
}
export const notificationService = {
  enqueueSnackbar: ({
    message,
    variant = "info",
    autoHideDuration = 4000,
    title,
  }: ShowNotificationProps) => {
    // Map variants to Mantine color
    const colorMap: Record<NotificationVariant, string> = {
      success: "green",
      error: "red",
      info: "blue",
      warning: "yellow",
    };
    notifications.show({
      title,
      message,
      color: colorMap[variant],
      autoClose: autoHideDuration,
    });
  },
};
// Hook replacement for useSnackbar
export function useSnackbar() {
  return { enqueueSnackbar: notificationService.enqueueSnackbar };
}
// For backwards compatibility - can remove if not needed
export default function ToastContainer() {
  return null;
}
