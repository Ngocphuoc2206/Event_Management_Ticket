import type { ApiResult } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

function normalizePublicEventsEndpoint() {
  const rawEndpoint =
    process.env.NEXT_PUBLIC_EVENTS_ENDPOINT ||
    process.env.NEXT_PUBLIC_PUBLIC_EVENTS_ENDPOINT ||
    "/api/events";

  return rawEndpoint.replace(/\/+$/, "");
}

const PUBLIC_EVENTS_ENDPOINT = normalizePublicEventsEndpoint();

type UnknownRecord = Record<string, unknown>;

export type CustomerEventTicketType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  saleStart?: string;
  saleEnd?: string;
  status?: string;
  description?: string;
};

export type CustomerEventSummary = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  venueName: string;
  address: string;
  city: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  minPrice: number;
  status: string;
  ticketCount: number;
  availableTickets: number;
};

export type CustomerEventDetail = CustomerEventSummary & {
  ticketTypes: CustomerEventTicketType[];
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getStringValue(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getNumberValue(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value);
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
}

function getArrayValue(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function formatTicketTypeName(rawName: string, fallbackId: string) {
  const source = rawName || fallbackId;
  return (
    source
      .replace(/^TICKET[_-]?/i, "")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (character) => character.toUpperCase()) || "Ticket"
  );
}

function unwrapResponseData<T>(data: ApiResult<T> | T | null | undefined) {
  if (!data) {
    return null;
  }

  const apiResultData = getApiResultData<T>(data as ApiResult<T>);
  if (apiResultData !== null && apiResultData !== undefined) {
    return apiResultData;
  }

  return data as T;
}

function extractCollection(data: unknown) {
  if (Array.isArray(data)) {
    return data;
  }

  if (!isRecord(data)) {
    return [];
  }

  const itemsCandidate = getArrayValue(data, [
    "items",
    "content",
    "data",
    "results",
    "events",
  ]);

  if (itemsCandidate.length > 0) {
    return itemsCandidate;
  }

  return [];
}

function mapTicketType(rawTicketType: unknown): CustomerEventTicketType | null {
  if (!isRecord(rawTicketType)) {
    return null;
  }

  const id = getStringValue(rawTicketType, ["id", "ticketTypeId"]);
  if (!id) {
    return null;
  }

  const quantity = getNumberValue(rawTicketType, [
    "quantity",
    "totalQuantity",
    "stock",
  ]);
  const directAvailableQuantity = getNumberValue(rawTicketType, [
    "availableQuantity",
    "remainingQuantity",
    "quantityAvailable",
    "available",
    "stockLeft",
  ]);
  const soldQuantity = getNumberValue(rawTicketType, [
    "soldQuantity",
    "sold_quantity",
  ]);
  const hasDirectAvailableQuantity =
    Object.prototype.hasOwnProperty.call(rawTicketType, "availableQuantity") ||
    Object.prototype.hasOwnProperty.call(rawTicketType, "remainingQuantity") ||
    Object.prototype.hasOwnProperty.call(rawTicketType, "quantityAvailable") ||
    Object.prototype.hasOwnProperty.call(rawTicketType, "available") ||
    Object.prototype.hasOwnProperty.call(rawTicketType, "stockLeft");
  const hasSoldQuantity =
    Object.prototype.hasOwnProperty.call(rawTicketType, "soldQuantity") ||
    Object.prototype.hasOwnProperty.call(rawTicketType, "sold_quantity");
  const availableQuantity = hasDirectAvailableQuantity
    ? directAvailableQuantity
    : hasSoldQuantity
      ? Math.max(quantity - soldQuantity, 0)
      : quantity;
  const rawName = getStringValue(rawTicketType, [
    "name",
    "title",
    "ticketTypeName",
  ]);

  return {
    id,
    name: formatTicketTypeName(rawName, id),
    price: getNumberValue(rawTicketType, ["price", "amount", "unitPrice"]),
    quantity,
    availableQuantity,
    saleStart: getStringValue(rawTicketType, [
      "saleStart",
      "salesStart",
      "sale_start",
      "startTime",
    ]),
    saleEnd: getStringValue(rawTicketType, [
      "saleEnd",
      "salesEnd",
      "sale_end",
      "endTime",
    ]),
    status: getStringValue(rawTicketType, ["status"]),
    description: getStringValue(rawTicketType, [
      "description",
      "shortDescription",
    ]),
  };
}

function mapEventSummary(rawEvent: unknown): CustomerEventSummary | null {
  if (!isRecord(rawEvent)) {
    return null;
  }

  const id = getStringValue(rawEvent, ["id", "eventId"]);
  if (!id) {
    return null;
  }

  const embeddedTickets = getArrayValue(rawEvent, [
    "ticketTypes",
    "tickets",
    "ticketTiers",
    "eventTickets",
  ])
    .map(mapTicketType)
    .filter(
      (ticketType): ticketType is CustomerEventTicketType =>
        ticketType !== null,
    );
  const explicitAvailableTickets = getNumberValue(rawEvent, [
    "availableTickets",
    "remainingTickets",
    "ticketsAvailable",
    "quantityAvailable",
  ]);

  return {
    id,
    title:
      getStringValue(rawEvent, ["title", "eventName", "name"]) ||
      "Untitled event",
    shortDescription: getStringValue(rawEvent, [
      "shortDescription",
      "summary",
      "subtitle",
    ]),
    description: getStringValue(rawEvent, ["description", "details"]),
    category: getStringValue(rawEvent, ["category", "type"]) || "General",
    venueName: getStringValue(rawEvent, ["venueName", "venue", "location"]),
    address: getStringValue(rawEvent, ["address"]),
    city: getStringValue(rawEvent, ["city"]),
    bannerUrl: getStringValue(rawEvent, [
      "bannerUrl",
      "imageUrl",
      "thumbnailUrl",
    ]),
    startTime: getStringValue(rawEvent, [
      "startTime",
      "eventStartTime",
      "date",
    ]),
    endTime: getStringValue(rawEvent, ["endTime", "eventEndTime"]),
    minPrice: getNumberValue(rawEvent, ["minPrice", "startingPrice", "price"]),
    status: getStringValue(rawEvent, ["status"]) || "PUBLISHED",
    ticketCount: embeddedTickets.length,
    availableTickets:
      explicitAvailableTickets ||
      embeddedTickets.reduce(
        (sum, ticketType) => sum + ticketType.availableQuantity,
        0,
      ),
  };
}

async function getEventTicketTypesFromEndpoint(eventId: string) {
  try {
    const response = await axiosClient.get<ApiResult<unknown> | unknown>(
      `${PUBLIC_EVENTS_ENDPOINT}/${eventId}/ticket-types`,
    );
    const rawData = unwrapResponseData(response.data);
    return extractCollection(rawData)
      .map(mapTicketType)
      .filter(
        (ticketType): ticketType is CustomerEventTicketType =>
          ticketType !== null,
      );
  } catch {
    return [];
  }
}

function getEmbeddedTicketTypes(rawEvent: unknown) {
  if (!isRecord(rawEvent)) {
    return [];
  }

  return getArrayValue(rawEvent, [
    "ticketTypes",
    "tickets",
    "ticketTiers",
    "eventTickets",
  ])
    .map(mapTicketType)
    .filter(
      (ticketType): ticketType is CustomerEventTicketType =>
        ticketType !== null,
    );
}

export async function getPublicEvents(params?: {
  search?: string;
  category?: string;
  size?: number;
}) {
  const response = await axiosClient.get<ApiResult<unknown> | unknown>(
    PUBLIC_EVENTS_ENDPOINT,
    {
      params: {
        ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params?.category && params.category !== "All"
          ? { category: params.category }
          : {}),
        ...(params?.size ? { size: params.size } : {}),
      },
    },
  );

  const rawData = unwrapResponseData(response.data);
  return extractCollection(rawData)
    .map(mapEventSummary)
    .filter((event): event is CustomerEventSummary => event !== null);
}

export async function getPublicEventDetail(eventId: string) {
  const response = await axiosClient.get<ApiResult<unknown> | unknown>(
    `${PUBLIC_EVENTS_ENDPOINT}/${eventId}`,
  );

  const rawData = unwrapResponseData(response.data);
  const summary = mapEventSummary(rawData);

  if (!summary) {
    throw new Error("Event detail not found.");
  }

  const embeddedTicketTypes = getEmbeddedTicketTypes(rawData);
  const ticketTypes =
    embeddedTicketTypes.length > 0
      ? embeddedTicketTypes
      : await getEventTicketTypesFromEndpoint(eventId);

  return {
    ...summary,
    ticketTypes,
    ticketCount: ticketTypes.length || summary.ticketCount,
    availableTickets:
      ticketTypes.length > 0
        ? ticketTypes.reduce(
            (sum, ticketType) => sum + ticketType.availableQuantity,
            0,
          )
        : summary.availableTickets,
  } satisfies CustomerEventDetail;
}
