import type { ApiResult } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";
import { ORGANIZER_EVENT_MEDIA_UPLOAD_ENDPOINT } from "@/features/organizer/events/constants";

const DEFAULT_MAX_FILE_MB = 10;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

type UploadResponse = {
  url?: string;
  fileUrl?: string;
  location?: string;
};

export type OrganizerUploadCategory = "banner" | "gallery";

function getMaxBytes() {
  const maxMbText = process.env.NEXT_PUBLIC_ORGANIZER_IMAGE_MAX_MB;
  const maxMb = Number(maxMbText);

  if (Number.isFinite(maxMb) && maxMb > 0) {
    return maxMb * 1024 * 1024;
  }

  return DEFAULT_MAX_FILE_MB * 1024 * 1024;
}

export function validateOrganizerImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return {
      ok: false,
      message: "Chi cho phep JPG, PNG hoac WebP.",
    };
  }

  if (file.size > getMaxBytes()) {
    return {
      ok: false,
      message: "Kich thuoc file vuot qua gioi han cho phep.",
    };
  }

  return { ok: true as const };
}

function extractUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const direct = payload as UploadResponse;
  if (typeof direct.url === "string" && direct.url.trim()) {
    return direct.url;
  }

  if (typeof direct.fileUrl === "string" && direct.fileUrl.trim()) {
    return direct.fileUrl;
  }

  if (typeof direct.location === "string" && direct.location.trim()) {
    return direct.location;
  }

  const nested = payload as { data?: UploadResponse; result?: UploadResponse; results?: UploadResponse };
  return extractUrl(nested.data ?? nested.result ?? nested.results);
}

export async function uploadOrganizerMedia(file: File, category: OrganizerUploadCategory = "banner") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const response = await axiosClient.post<ApiResult<UploadResponse>>(
    ORGANIZER_EVENT_MEDIA_UPLOAD_ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const url = extractUrl(response.data);

  if (!url) {
    throw new Error("Khong nhan duoc URL file tu backend.");
  }

  return {
    url,
    raw: response.data,
  };
}
