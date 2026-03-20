import axiosClient from "@/features/httpClient/axiosClient";

import type { ApiResult, LoginPayload, LoginResponse } from "@/features/auth/types";

const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || "/auth/login";

export async function loginUser(payload: LoginPayload) {
  const response = await axiosClient.post<ApiResult<LoginResponse>>(LOGIN_ENDPOINT, payload);

  return response.data;
}
