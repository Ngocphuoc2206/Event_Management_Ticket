import type { ApiResult } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";
import { ORGANIZER_CREATE_EVENT_ENDPOINT, ORGANIZER_EVENTS_ENDPOINT } from "@/features/organizer/events/constants";
import type {
  OrganizerCreateEventPayload,
  OrganizerEvent,
  OrganizerEventMutationPayload,
  OrganizerEventStatus,
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

export async function getOrganizerEventById(eventId: string) {
  const response = await axiosClient.get<ApiResult<OrganizerEvent>>(
    `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}`,
  );

  return response.data;
}

export async function updateOrganizerEvent(eventId: string, payload: OrganizerEventMutationPayload) {
  const response = await axiosClient.put<ApiResult<OrganizerEvent>>(
    `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}`,
    payload,
  );

  return response.data;
}

export async function updateOrganizerEventStatus(eventId: string, status: OrganizerEventStatus | string) {
  return updateOrganizerEvent(eventId, { status });
}

export async function submitOrganizerEventForApproval(eventId: string) {
  const response = await axiosClient.put<ApiResult<OrganizerEvent>>(
    `${ORGANIZER_EVENTS_ENDPOINT}/${eventId}/submit`,
  );

  return response.data;
}

export async function publishOrganizerEvent(eventId: string) {
  const response = await updateOrganizerEventStatus(eventId, "PUBLISHED");

  return response;
}

export async function saveOrganizerEventAsDraft(eventId: string) {
  const response = await updateOrganizerEventStatus(eventId, "DRAFT");

  return response;
}
