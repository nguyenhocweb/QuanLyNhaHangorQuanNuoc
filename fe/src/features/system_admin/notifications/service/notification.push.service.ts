import axiosClient from "@/src/core/api/axios-instance";
import { PushNotificationValues } from "../schema/notification.push.schema";

export const pushNotificationService = async (payload: PushNotificationValues) => {
  const response = await axiosClient.post('/system-admin/notifications/push', payload);
  return response.data;
};
