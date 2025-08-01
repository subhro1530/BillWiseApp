// utils/notification.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

export async function scheduleMonthlyReminder() {
  if (!Device.isDevice) {
    console.log("Must use physical device for notifications");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger = {
    hour: 9,
    minute: 0,
    day: 1,
    repeats: true,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📅 Monthly Payment Reminder",
      body: "Check and remind unpaid students for this month.",
      sound: "default",
    },
    trigger,
  });
}
