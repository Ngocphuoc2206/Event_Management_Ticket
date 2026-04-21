import type { ApiResult } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const MY_NOTIFICATIONS_ENDPOINT =
  process.env.NEXT_PUBLIC_MY_NOTIFICATIONS_ENDPOINT || "/api/customer/me/notifications";

export type CustomerNotification = {
  id: string;
  title: string;
  content: string;
  type: string;
  orderId?: string | null;
  read: boolean;
  createdAt: string;
  readAt?: string | null;
};

export async function getMyNotifications() {
  const response = await axiosClient.get<ApiResult<CustomerNotification[]>>(
    MY_NOTIFICATIONS_ENDPOINT,
  );

  return getApiResultData<CustomerNotification[]>(response.data) ?? [];
}

export async function markNotificationAsRead(notificationId: string) {
  const response = await axiosClient.patch<ApiResult<CustomerNotification>>(
    `${MY_NOTIFICATIONS_ENDPOINT}/${notificationId}/read`,
  );

  return getApiResultData<CustomerNotification>(response.data);
}
