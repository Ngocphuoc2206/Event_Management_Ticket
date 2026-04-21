import type { ApiResult } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiErrorMessage } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";
import { ORGANIZER_CREATE_EVENT_ENDPOINT, ORGANIZER_EVENTS_ENDPOINT } from "@/features/organizer/events/constants";
import type {
  OrganizerCreateEventPayload,
  OrganizerEvent,
  OrganizerEventsPageData,
  OrganizerUpdateEventPayload,
} from "@/features/organizer/events/types";

export async function createOrganizerEvent(payload: OrganizerCreateEventPayload) {
  try {
    const response = await axiosClient.post<ApiResult<OrganizerEvent>>(
      ORGANIZER_CREATE_EVENT_ENDPOINT,
      payload,
    );

    ensureApiResultSuccess(response.data, "Tao su kien that bai.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Tao su kien that bai."));
  }
}

export async function getOrganizerEvents(params?: { page?: number; size?: number }) {
  try {
    const response = await axiosClient.get<ApiResult<OrganizerEventsPageData>>(
      ORGANIZER_EVENTS_ENDPOINT,
      { params },
    );

    ensureApiResultSuccess(response.data, "Khong the tai danh sach su kien.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the tai danh sach su kien."));
  }
}

export async function getOrganizerEventById(eventId: string) {
  try {
    const response = await axiosClient.get<ApiResult<OrganizerEvent>>(
      `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}`,
    );

    ensureApiResultSuccess(response.data, "Khong the tai chi tiet su kien.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the tai chi tiet su kien."));
  }
}

export async function updateOrganizerEvent(eventId: string, payload: OrganizerUpdateEventPayload) {
  try {
    const response = await axiosClient.put<ApiResult<OrganizerEvent>>(
      `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}`,
      payload,
    );

    ensureApiResultSuccess(response.data, "Cap nhat su kien that bai.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Cap nhat su kien that bai."));
  }
}

export async function saveOrganizerEventDraft(payload: OrganizerCreateEventPayload, eventId?: string) {
  if (eventId) {
    return updateOrganizerEvent(eventId, { ...payload, status: "DRAFT" });
  }

  return createOrganizerEvent({ ...payload, status: "DRAFT" });
}

export async function submitOrganizerEventForApproval(eventId: string) {
  try {
    const response = await axiosClient.put<ApiResult<OrganizerEvent>>(
      `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}/submit`,
    );

    ensureApiResultSuccess(response.data, "Gui duyet su kien that bai.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Gui duyet su kien that bai."));
  }
}

export async function publishOrganizerEvent(eventId: string) {
  try {
    const response = await axiosClient.put<ApiResult<OrganizerEvent>>(`${ORGANIZER_EVENTS_ENDPOINT}/${eventId}`, {
      status: "PUBLISHED",
    });

    ensureApiResultSuccess(response.data, "Publish su kien that bai.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Publish su kien that bai."));
  }
}
