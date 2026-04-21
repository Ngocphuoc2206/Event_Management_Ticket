import type { ApiResult } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

export type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: "ADMIN";
};

export type UpdateAdminProfilePayload = {
  fullName: string;
  phone: string;
  bio?: string;
};

export async function getAdminProfile(): Promise<AdminProfile | null> {
  try {
    const response = await axiosClient.get<ApiResult<AdminProfile>>("/api/users/me");
    return getApiResultData<AdminProfile>(response.data) ?? null;
  } catch {
    return null;
  }
}

export async function updateAdminProfile(
  payload: UpdateAdminProfilePayload,
): Promise<AdminProfile | null> {
  try {
    const response = await axiosClient.put<ApiResult<AdminProfile>>(
      "/api/users/me",
      payload,
    );
    return getApiResultData<AdminProfile>(response.data) ?? null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update profile");
  }
}
