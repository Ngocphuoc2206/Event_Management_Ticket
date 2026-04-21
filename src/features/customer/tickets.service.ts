import type { ApiResult } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const MY_TICKETS_ENDPOINT =
  process.env.NEXT_PUBLIC_MY_TICKETS_ENDPOINT || "/api/me/tickets";

export type CustomerTicketResponse = {
  id: string;
  address?: string;
  city?: string;
  code?: string;
  eventEndTime?: string;
  eventId?: string;
  eventName?: string;
  eventTitle?: string;
  eventDate?: string;
  eventStartTime?: string;
  issuedAt?: string;
  location?: string;
  orderId?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  qrImageUrl?: string;
  status?: string;
  startTime?: string;
  ticketCategory?: string;
  ticketCode?: string;
  ticketTypeId?: string;
  ticketTypeName?: string;
  used?: boolean;
  venue?: string;
  venueName?: string;
  createdAt?: string;
};

export type GetMyTicketsParams = {
  type?: "upcoming" | "past";
};

export async function getMyTickets(params?: GetMyTicketsParams) {
  const response = await axiosClient.get<ApiResult<CustomerTicketResponse[]>>(
    MY_TICKETS_ENDPOINT,
    {
      params: params?.type ? { type: params.type } : undefined,
    },
  );

  return getApiResultData<CustomerTicketResponse[]>(response.data) ?? [];
}
