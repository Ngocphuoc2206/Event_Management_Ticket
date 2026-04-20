import { LOGOUT_ENDPOINT } from "@/features/auth/constants";
import type { ApiResult, LogoutPayload, LogoutResponse } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

export async function logoutUser(payload?: LogoutPayload) {
  const response = await axiosClient.post<ApiResult<LogoutResponse>>(
    LOGOUT_ENDPOINT,
    payload ?? {},
  );

  return response.data;
}
