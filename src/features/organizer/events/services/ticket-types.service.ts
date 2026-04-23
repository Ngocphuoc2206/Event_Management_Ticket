import type { ApiResult } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";
import type {
  OrganizerCreateTicketTypePayload,
  OrganizerTicketType,
  OrganizerTicketTypesPageData,
  OrganizerTicketTypeStatus,
  OrganizerUpdateTicketTypePayload,
} from "@/features/organizer/events/types";

type TicketTypeListQuery = {
  search?: string;
  status?: OrganizerTicketTypeStatus;
  page?: number;
  size?: number;
};

type UnknownRecord = Record<string, unknown>;

function toRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function toNumberOrZero(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapTicketTypeItem(item: unknown, index: number): OrganizerTicketType {
  const value = toRecord(item);

  return {
    id:
      (typeof value.id === "string" && value.id) ||
      (typeof value.ticketTypeId === "string" && value.ticketTypeId) ||
      `ticket-type-${index + 1}`,
    name:
      (typeof value.name === "string" && value.name.trim()) ||
      (typeof value.ticketName === "string" && value.ticketName.trim()) ||
      "Unnamed Ticket",
    price: toNumberOrZero(value.price),
    quantity: toNumberOrZero(value.quantity),
    saleStart:
      (typeof value.saleStart === "string" && value.saleStart) ||
      (typeof value.sale_start === "string" && value.sale_start) ||
      new Date().toISOString(),
    saleEnd:
      (typeof value.saleEnd === "string" && value.saleEnd) ||
      (typeof value.sale_end === "string" && value.sale_end) ||
      new Date().toISOString(),
    eventId:
      (typeof value.eventId === "string" && value.eventId) ||
      (typeof value.event_id === "string" && value.event_id) ||
      undefined,
    status:
      value.status === "ACTIVE" || value.status === "INACTIVE"
        ? value.status
        : undefined,
  };
}

function getTicketItemsFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const objectPayload = toRecord(payload);

  if (Array.isArray(objectPayload.items)) {
    return objectPayload.items;
  }

  if (Array.isArray(objectPayload.content)) {
    return objectPayload.content;
  }

  if (Array.isArray(objectPayload.ticketTypes)) {
    return objectPayload.ticketTypes;
  }

  return [];
}

export async function getOrganizerTicketTypes(eventId: string, params?: TicketTypeListQuery) {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>(
      `http://localhost:8080/api/organizer/events/${eventId}/ticket-types`,
      { 
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 100,
          search: params?.search,
          status: params?.status,
        }
      },
    );

    ensureApiResultSuccess(response.data, "Khong the tai danh sach loai ve.");
    const payload = getApiResultData(response.data as ApiResult<unknown>);
    const items = getTicketItemsFromPayload(payload);
    return items.map((item, index) => mapTicketTypeItem(item, index));
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Khong the tai danh sach loai ve."),
    );
  }
}

export async function createOrganizerTicketType(
  eventId: string,
  payload: OrganizerCreateTicketTypePayload,
) {
  try {
    const response = await axiosClient.post<ApiResult<OrganizerTicketType>>(
      `http://localhost:8080/api/organizer/events/${eventId}/ticket-types`,
      payload,
    );

    ensureApiResultSuccess(response.data, "Khong the tao loai ve.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the tao loai ve."));
  }
}

export async function updateOrganizerTicketType(
  ticketTypeId: string,
  payload: OrganizerUpdateTicketTypePayload,
) {
  try {
    const response = await axiosClient.put<ApiResult<OrganizerTicketType>>(
      `http://localhost:8080/api/organizer/ticket-types/${ticketTypeId}`,
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
      `http://localhost:8080/api/organizer/ticket-types/${ticketTypeId}`,
    );

    ensureApiResultSuccess(response.data, "Khong the xoa loai ve.");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Khong the xoa loai ve."));
  }
}
