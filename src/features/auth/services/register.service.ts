import { REGISTER_ENDPOINT } from "@/features/auth/constants";
import type { ApiResult, RegisterPayload, RegisterResponse } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

export async function registerUser(payload: RegisterPayload) {
  const response = await axiosClient.post<ApiResult<RegisterResponse>>(
    REGISTER_ENDPOINT,
    payload,
    {
      headers: {
        "X-Skip-Auth": "true",
      },
    },
  );

  return response.data;
}
