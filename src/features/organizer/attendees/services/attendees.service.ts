import type { ApiResult } from "@/features/auth/types";
import {
  ensureApiResultSuccess,
  getApiErrorMessage,
} from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

type AttendeesQuery = {
  search?: string;
  status?: "true" | "false";
  sortBy?: "fullName" | "ticketType" | "check-in";
  sortDir?: "asc" | "desc";
};

export async function getOrganizerAttendees(
  eventId: string,
  params?: AttendeesQuery,
) {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>(
      `/api/organizer/events/${eventId}/attendees`,
      { params },
    );

    ensureApiResultSuccess(response.data, "Không thể tải danh sách attendee.");
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Không thể tải danh sách attendee."),
    );
  }
}

export async function checkInOrganizerAttendee(ticketCode: string) {
  try {
    const response = await axiosClient.post<ApiResult<unknown>>(
      `/api/organizer/check-in`,
      { ticketCode },
    );

    ensureApiResultSuccess(response.data, "Check-in attendee thất bại.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Check-in attendee thất bại."));
  }
}
