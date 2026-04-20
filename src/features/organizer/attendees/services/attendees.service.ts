import type { ApiResult } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

const ORGANIZER_ATTENDEES_BASE =
  process.env.NEXT_PUBLIC_ORGANIZER_ATTENDEES_BASE || "/api/organizer";

export type OrganizerAttendeeSortBy = "fullName" | "ticketType" | "check-in";
export type OrganizerSortDir = "asc" | "desc";

export type OrganizerAttendee = {
  id?: string;
  orderItemId?: string;
  username?: string;
  fullName?: string;
  email?: string;
  ticketType?: string;
  checkIn?: boolean;
};

export async function getOrganizerAttendees(
  eventId: string,
  params?: {
    search?: string;
    status?: boolean;
    sortBy?: OrganizerAttendeeSortBy;
    sortDir?: OrganizerSortDir;
  },
) {
  const response = await axiosClient.get<ApiResult<OrganizerAttendee[]>>(
    `${ORGANIZER_ATTENDEES_BASE}/events/${eventId}/attendees`,
    { params },
  );

  return response.data;
}

export async function checkInOrganizerAttendee(orderItemId: string) {
  const response = await axiosClient.post<ApiResult<unknown>>(
    `${ORGANIZER_ATTENDEES_BASE}/check-in`,
    { orderItemId },
  );

  return response.data;
}
