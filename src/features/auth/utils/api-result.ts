import type { ApiResponse, ApiResult } from "@/features/auth/types";

function isApiResponseEnvelope<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    ("data" in response || "message" in response || "success" in response)
  );
}

export function getApiResultData<T>(response: ApiResult<T>): T | undefined {
  if (isApiResponseEnvelope(response)) {
    return response.data;
  }

  return response;
}

export function getApiResultMessage<T>(response: ApiResult<T>) {
  if (isApiResponseEnvelope(response)) {
    return response.message;
  }

  return undefined;
}
