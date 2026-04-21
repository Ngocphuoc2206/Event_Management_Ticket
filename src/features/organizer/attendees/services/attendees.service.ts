import type { ApiResult } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiErrorMessage } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

type AttendeesQuery = {
  search?: string;
  status?: "true" | "false";
  sortBy?: "fullName" | "ticketType" | "check-in";
  sortDir?: "asc" | "desc";
};

const ORGANIZER_API_BASE =
  process.env.NEXT_PUBLIC_ORGANIZER_API_BASE || "http://localhost:8080/api/organizer";

export async function getOrganizerAttendees(eventId: string, params?: AttendeesQuery) {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>(
      `${ORGANIZER_API_BASE}/events/${eventId}/attendees`,
      { params },
    );

    ensureApiResultSuccess(response.data, "Khong the tai danh sach attendee.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the tai danh sach attendee."));
  }
}

export async function checkInOrganizerAttendee(orderItemId: string) {
  try {
    const response = await axiosClient.post<ApiResult<unknown>>(
      `${ORGANIZER_API_BASE}/check-in`,
      { orderItemId },
    );

    ensureApiResultSuccess(response.data, "Check-in attendee that bai.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Check-in attendee that bai."));
  }
}
