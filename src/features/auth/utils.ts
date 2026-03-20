import { isAxiosError } from "axios";

import type { ApiResponse, ApiResult, AuthPayload, UserRole } from "@/features/auth/types";

export function isApiResponse<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return typeof response === "object" && response !== null && !Array.isArray(response);
}

export function getApiResultData<T>(response: ApiResult<T>): T | undefined {
  if (!isApiResponse(response)) {
    return response;
  }

  return response.results ?? response.result ?? response.data;
}

export function getApiResultMessage<T>(response: ApiResult<T>): string | undefined {
  if (!isApiResponse(response)) {
    return undefined;
  }

  return response.message;
}

export function getApiErrorMessage<T>(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiResponse<T> | string>(error)) {
    return fallback;
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === "object" && "message" in responseData) {
    const message = responseData.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export function persistAuthTokens(payload?: AuthPayload) {
  if (typeof window === "undefined" || !payload) {
    return;
  }

  if (payload.accessToken) {
    localStorage.setItem("accessToken", payload.accessToken);
  }

  if (payload.refreshToken) {
    localStorage.setItem("refreshToken", payload.refreshToken);
  }

  if (payload.role) {
    localStorage.setItem("userRole", payload.role);
  }
}

export function getPostAuthRoute(role?: UserRole) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "ORGANIZER":
      return "/organizer";
    case "CUSTOMER":
      return "/customer";
    default:
      return "/";
  }
}
