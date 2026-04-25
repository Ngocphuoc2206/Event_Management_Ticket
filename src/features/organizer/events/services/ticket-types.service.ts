import type { ApiResult } from "@/features/auth/types";
import {
  ensureApiResultSuccess,
  getApiErrorMessage,
  getApiResultData,
} from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";
import type {
  OrganizerCreateTicketTypePayload,
  OrganizerTicketType,
  OrganizerTicketTypesPageData,
  OrganizerTicketTypeStatus,
  OrganizerUpdateTicketTypePayload,
} from "@/features/organizer/events/types";

function normalizeOrganizerApiBase() {
  const rawBase =
    process.env.NEXT_PUBLIC_ORGANIZER_API_BASE ||
    process.env.NEXT_PUBLIC_ORGANIZER_EVENTS_ENDPOINT ||
    process.env.NEXT_PUBLIC_ORGANIZER_CREATE_EVENT_ENDPOINT ||
    "/api/organizer";

  const sanitizedBase = rawBase.replace(/\/+$/, "");

  if (sanitizedBase.endsWith("/events")) {
    return sanitizedBase.slice(0, -"/events".length);
  }

  return sanitizedBase;
}

const ORGANIZER_API_BASE = normalizeOrganizerApiBase();

type TicketTypeListQuery = {
  search?: string;
  status?: OrganizerTicketTypeStatus;
};

function toNumberOrZero(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapTicketTypeItem(item: unknown, index: number): OrganizerTicketType {
  const value = (item && typeof item === "object" ? item : {}) as Record<
    string,
    unknown
  >;

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
    soldQuantity: toNumberOrZero(value.soldQuantity ?? value.sold_quantity),
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
      value.status === "ACTIVE" ||
      value.status === "INACTIVE" ||
      value.status === "SOLD_OUT" ||
      value.status === "CANCELLED" ||
      value.status === "EXPIRED"
        ? value.status
        : undefined,
  };
}

function getTicketItemsFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as {
    items?: unknown[];
    content?: unknown[];
    ticketTypes?: unknown[];
  };

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

export async function getOrganizerTicketTypes(
  eventId: string,
  params?: TicketTypeListQuery,
) {
  try {
    const response = await axiosClient.get<
      ApiResult<OrganizerTicketTypesPageData>
    >(`${ORGANIZER_API_BASE}/events/${eventId}/ticket-types`, { params });

    ensureApiResultSuccess(response.data, "Cannot load ticket types.");
    const payload = getApiResultData(response.data as ApiResult<unknown>);
    const items = getTicketItemsFromPayload(payload);

    return items.map((item, index) => mapTicketTypeItem(item, index));
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Cannot load ticket types."));
  }
}

export async function createOrganizerTicketType(
  eventId: string,
  payload: OrganizerCreateTicketTypePayload,
) {
  try {
    // Ensure eventId is not empty
    if (!eventId || eventId.trim() === "") {
      throw new Error("Event ID must be provided to create ticket type.");
    }

    // Prepare payload with correct format
    const requestPayload = {
      name: payload.name,
      price: Number(payload.price),
      quantity: Number(payload.quantity),
      saleStart: payload.saleStart, // Already in ISO 8601 format from form
      saleEnd: payload.saleEnd, // Already in ISO 8601 format from form
    };

    const response = await axiosClient.post<ApiResult<unknown>>(
      `${ORGANIZER_API_BASE}/events/${eventId}/ticket-types`,
      requestPayload,
    );

    ensureApiResultSuccess(response.data, "Cannot create ticket type.");
    const data = getApiResultData(response.data as ApiResult<unknown>);
    return mapTicketTypeItem(data, 0);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Cannot create ticket type."));
  }
}

export async function updateOrganizerTicketType(
  ticketTypeId: string,
  payload: OrganizerUpdateTicketTypePayload,
) {
  try {
    // Prepare payload with correct data types
    const requestPayload: Record<string, unknown> = {};

    if (payload.name !== undefined) {
      requestPayload.name = payload.name;
    }
    if (payload.price !== undefined) {
      requestPayload.price = Number(payload.price);
    }
    if (payload.quantity !== undefined) {
      requestPayload.quantity = Number(payload.quantity);
    }
    if (payload.saleStart !== undefined) {
      requestPayload.saleStart = payload.saleStart; // Already in ISO 8601 format
    }
    if (payload.saleEnd !== undefined) {
      requestPayload.saleEnd = payload.saleEnd; // Already in ISO 8601 format
    }
    if (payload.status !== undefined) {
      requestPayload.status = payload.status;
    }

    const response = await axiosClient.put<ApiResult<unknown>>(
      `${ORGANIZER_API_BASE}/ticket-types/${ticketTypeId}`,
      requestPayload,
    );

    ensureApiResultSuccess(response.data, "Cannot update ticket type.");
    const data = getApiResultData(response.data as ApiResult<unknown>);
    return mapTicketTypeItem(data, 0);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Cannot update ticket type."));
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
