import type { ApiResult } from "@/features/auth/types";
import axiosClient from "@/features/httpClient/axiosClient";

const ORGANIZER_TICKET_TYPES_BASE =
  process.env.NEXT_PUBLIC_ORGANIZER_TICKET_TYPES_BASE || "/api/organizer";

export type OrganizerTicketTypeStatus = "ACTIVE" | "INACTIVE";

export type OrganizerTicketType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  saleStart: string;
  saleEnd: string;
  status?: OrganizerTicketTypeStatus | string;
};

export type CreateOrganizerTicketTypePayload = {
  name: string;
  price: number;
  quantity: number;
  saleStart: string;
  saleEnd: string;
};

export type UpdateOrganizerTicketTypePayload = Partial<CreateOrganizerTicketTypePayload> & {
  status?: OrganizerTicketTypeStatus | string;
};

export async function getOrganizerTicketTypes(
  eventId: string,
  params?: { search?: string; status?: OrganizerTicketTypeStatus },
) {
  const response = await axiosClient.get<ApiResult<OrganizerTicketType[]>>(
    `${ORGANIZER_TICKET_TYPES_BASE}/events/${eventId}/ticket-types`,
    { params },
  );

  return response.data;
}

export async function createOrganizerTicketType(
  eventId: string,
  payload: CreateOrganizerTicketTypePayload,
) {
  const response = await axiosClient.post<ApiResult<OrganizerTicketType>>(
    `${ORGANIZER_TICKET_TYPES_BASE}/events/${eventId}/ticket-types`,
    payload,
  );

  return response.data;
}

export async function updateOrganizerTicketType(
  ticketTypeId: string,
  payload: UpdateOrganizerTicketTypePayload,
) {
  const response = await axiosClient.put<ApiResult<OrganizerTicketType>>(
    `${ORGANIZER_TICKET_TYPES_BASE}/ticket-types/${ticketTypeId}`,
    payload,
  );

  return response.data;
}

export async function deleteOrganizerTicketType(ticketTypeId: string) {
  const response = await axiosClient.delete<ApiResult<unknown>>(
    `${ORGANIZER_TICKET_TYPES_BASE}/ticket-types/${ticketTypeId}`,
  );

  return response.data;
}
