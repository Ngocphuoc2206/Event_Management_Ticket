import { REFRESH_ENDPOINT } from "@/features/auth/constants";
import type { ApiResult, RefreshPayload, RefreshResponse } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

export async function refreshAuthToken(payload: RefreshPayload) {
  const response = await axiosClient.post<ApiResult<RefreshResponse>>(
    REFRESH_ENDPOINT,
    payload,
    {
      headers: {
        "X-Skip-Auth": "true",
      },
    },
  );

  return response.data;
}
