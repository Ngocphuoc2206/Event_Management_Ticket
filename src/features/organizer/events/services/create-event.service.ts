import type { ApiResult } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";
import { ORGANIZER_CREATE_EVENT_ENDPOINT, ORGANIZER_EVENTS_ENDPOINT } from "@/features/organizer/events/constants";
import type {
  OrganizerCreateEventPayload,
  OrganizerEvent,
  OrganizerEventsPageData,
} from "@/features/organizer/events/types";

export async function createOrganizerEvent(payload: OrganizerCreateEventPayload) {
  const response = await axiosClient.post<ApiResult<OrganizerEvent>>(
    ORGANIZER_CREATE_EVENT_ENDPOINT,
    payload,
  );

  return response.data;
}

export async function getOrganizerEvents(params?: { page?: number; size?: number }) {
  const response = await axiosClient.get<ApiResult<OrganizerEventsPageData>>(
    ORGANIZER_EVENTS_ENDPOINT,
    { params },
  );

  return response.data;
}

export async function submitOrganizerEventForApproval(eventId: string) {
  const response = await axiosClient.put<ApiResult<OrganizerEvent>>(
    `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}/submit`,
  );

  return response.data;
}
