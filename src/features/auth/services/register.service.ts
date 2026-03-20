import axiosClient from "@/features/httpClient/axiosClient";

import type { ApiResult, RegisterPayload, RegisterResponse } from "@/features/auth/types";

const REGISTER_ENDPOINT = process.env.NEXT_PUBLIC_REGISTER_ENDPOINT || "/auth/register";

export async function registerUser(payload: RegisterPayload) {
  const response = await axiosClient.post<ApiResult<RegisterResponse>>(
    REGISTER_ENDPOINT,
    payload
  );

  return response.data;
}
