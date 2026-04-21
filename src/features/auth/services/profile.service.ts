import { CHANGE_PASSWORD_ENDPOINT, USER_PROFILE_ENDPOINT } from "@/features/auth/constants";
import type {
  ApiResult,
  ChangePasswordPayload,
  LogoutResponse,
  UpdateProfilePayload,
  UserProfileResponse,
} from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

function resolveUserProfileEndpoint(userId: string) {
  return `${USER_PROFILE_ENDPOINT}/${userId}`;
}

function resolveChangePasswordEndpoint(userId: string) {
  return CHANGE_PASSWORD_ENDPOINT.replace("{id}", userId);
}

export async function getUserProfile(userId: string) {
  const response = await axiosClient.get<ApiResult<UserProfileResponse>>(resolveUserProfileEndpoint(userId));
  return response.data;
}

export async function updateUserProfile(userId: string, payload: UpdateProfilePayload) {
  const response = await axiosClient.put<ApiResult<UserProfileResponse>>(resolveUserProfileEndpoint(userId), payload);
  return response.data;
}

export async function changeUserPassword(userId: string, payload: ChangePasswordPayload) {
  const response = await axiosClient.post<ApiResult<LogoutResponse>>(resolveChangePasswordEndpoint(userId), payload);
  return response.data;
}
