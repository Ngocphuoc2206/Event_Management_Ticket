import type { ApiResult } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiErrorMessage } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";
import type {
  OrganizerCreateTicketTypePayload,
  OrganizerTicketType,
  OrganizerTicketTypeStatus,
  OrganizerUpdateTicketTypePayload,
} from "@/features/organizer/events/types";

const ORGANIZER_API_BASE =
  process.env.NEXT_PUBLIC_ORGANIZER_API_BASE || "http://localhost:8080/api/organizer";

type TicketTypeListQuery = {
  search?: string;
  status?: OrganizerTicketTypeStatus;
};

export async function getOrganizerTicketTypes(eventId: string, params?: TicketTypeListQuery) {
  try {
    const response = await axiosClient.get<ApiResult<OrganizerTicketType[]>>(
      `${ORGANIZER_API_BASE}/events/${eventId}/ticket-types`,
      { params },
    );

    ensureApiResultSuccess(response.data, "Khong the tai danh sach loai ve.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the tai danh sach loai ve."));
  }
}

export async function createOrganizerTicketType(eventId: string, payload: OrganizerCreateTicketTypePayload) {
  try {
    const response = await axiosClient.post<ApiResult<OrganizerTicketType>>(
      `${ORGANIZER_API_BASE}/events/${eventId}/ticket-types`,
      payload,
    );

    ensureApiResultSuccess(response.data, "Khong the tao loai ve.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the tao loai ve."));
  }
}

export async function updateOrganizerTicketType(ticketTypeId: string, payload: OrganizerUpdateTicketTypePayload) {
  try {
    const response = await axiosClient.put<ApiResult<OrganizerTicketType>>(
      `${ORGANIZER_API_BASE}/ticket-types/${ticketTypeId}`,
      payload,
    );

    ensureApiResultSuccess(response.data, "Khong the cap nhat loai ve.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the cap nhat loai ve."));
  }
}

export async function deleteOrganizerTicketType(ticketTypeId: string) {
  try {
    const response = await axiosClient.delete<ApiResult<{ id?: string }>>(
      `${ORGANIZER_API_BASE}/ticket-types/${ticketTypeId}`,
    );

    ensureApiResultSuccess(response.data, "Khong the xoa loai ve.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the xoa loai ve."));
  }
}
