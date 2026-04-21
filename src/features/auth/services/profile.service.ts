import {
  CHANGE_PASSWORD_ENDPOINT,
  USER_PROFILE_ENDPOINT,
} from "@/features/auth/constants";
import type {
  ApiResult,
  ChangePasswordPayload,
  LogoutResponse,
  UpdateProfilePayload,
  UserProfileResponse,
} from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

function resolveChangePasswordEndpoint(userId: string) {
  return CHANGE_PASSWORD_ENDPOINT.replace("{id}", userId);
}

export async function getUserProfile() {
  const response = await axiosClient.get<ApiResult<UserProfileResponse>>(
    USER_PROFILE_ENDPOINT,
  );
  return response.data;
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateProfilePayload,
) {
  const response = await axiosClient.put<ApiResult<UserProfileResponse>>(
    USER_PROFILE_ENDPOINT,
    payload,
  );
  return response.data;
}

export async function changeUserPassword(
  userId: string,
  payload: ChangePasswordPayload,
) {
  const response = await axiosClient.post<ApiResult<LogoutResponse>>(
    resolveChangePasswordEndpoint(userId),
    payload,
  );
  return response.data;
}
