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
  page?: number;
  size?: number;
};

export async function getOrganizerAttendees(
  eventId: string,
  params?: AttendeesQuery,
) {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>(
      `http://localhost:8080/api/organizer/events/${eventId}/attendees`,
      { 
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
          status: params?.status,
          sortBy: params?.sortBy ?? "fullName",
          sortDir: params?.sortDir ?? "asc",
        }
      },
    );

    ensureApiResultSuccess(response.data, "Khong the tai danh sach attendee.");
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Khong the tai danh sach attendee."),
    );
  }
}

export async function checkInOrganizerAttendee(orderItemId: string) {
  try {
    const response = await axiosClient.post<ApiResult<unknown>>(
      `http://localhost:8080/api/tickets/check-in`,
      { orderItemId },
    );

    ensureApiResultSuccess(response.data, "Check-in attendee that bai.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Check-in attendee that bai."));
  }
}
