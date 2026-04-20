import type { ApiResult } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiErrorMessage } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const ORGANIZER_MEDIA_UPLOAD_ENDPOINT =
  process.env.NEXT_PUBLIC_ORGANIZER_MEDIA_UPLOAD_ENDPOINT ||
  "http://localhost:8080/api/organizer/events/upload";

type UploadResponseData = {
  url?: string;
  fileUrl?: string;
  secureUrl?: string;
  objectKey?: string;
};

function extractUploadedUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as UploadResponseData;
  return candidate.url || candidate.fileUrl || candidate.secureUrl || null;
}

export async function uploadOrganizerBanner(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<ApiResult<UploadResponseData>>(
      ORGANIZER_MEDIA_UPLOAD_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const data = response.data as ApiResult<UploadResponseData>;
    ensureApiResultSuccess(data, "Upload that bai.");

    if (typeof data === "object" && data !== null && "data" in data) {
      const fromEnvelope = extractUploadedUrl((data as { data?: unknown }).data);
      if (fromEnvelope) {
        return fromEnvelope;
      }
    }

    const direct = extractUploadedUrl(data);
    if (direct) {
      return direct;
    }

    throw new Error("Upload succeeded but no file URL was returned by backend.");
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Upload that bai."));
  }
}

export const ORGANIZER_ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const ORGANIZER_MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
