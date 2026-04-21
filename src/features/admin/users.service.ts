import type { ApiResult, UserRole } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const ADMIN_USERS_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT || "/auth/admin/users";

export type AdminUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole | null;
  status?: AdminUserStatus | string | null;
};

export async function getAdminUsers() {
  const response = await axiosClient.get<ApiResult<AdminUser[]>>(
    ADMIN_USERS_ENDPOINT,
  );

  return getApiResultData<AdminUser[]>(response.data) ?? [];
}

export async function getAdminUser(userId: string) {
  const response = await axiosClient.get<ApiResult<AdminUser>>(
    `${ADMIN_USERS_ENDPOINT}/${userId}`,
  );

  return getApiResultData<AdminUser>(response.data);
}

export async function updateAdminUserStatus(
  userId: string,
  status: AdminUserStatus,
) {
  const response = await axiosClient.patch<ApiResult<AdminUser>>(
    `${ADMIN_USERS_ENDPOINT}/${userId}/status`,
    { status },
  );

  return getApiResultData<AdminUser>(response.data);
}
