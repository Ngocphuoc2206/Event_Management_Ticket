import { LOGIN_ENDPOINT } from "@/features/auth/constants";
import type { ApiResult, LoginPayload, LoginResponse } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

export async function loginUser(payload: LoginPayload) {
  const response = await axiosClient.post<ApiResult<LoginResponse>>(LOGIN_ENDPOINT, payload);

  return response.data;
}
