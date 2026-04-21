import { isAxiosError } from "axios";

import type { ApiResult } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiErrorMessage, getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

export type AdminEventStatus = "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED";

export type AdminEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  organizerName?: string;
  organizerId?: string;
  status: AdminEventStatus | string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  rejectReason?: string;
  bannerUrl?: string;
  category?: string;
};

export type AdminEventsQuery = {
  status?: AdminEventStatus;
  search?: string;
  page?: number;
  size?: number;
};

export type AdminEventsPage = {
  items: AdminEvent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

const ADMIN_EVENTS_ENDPOINT = "/api/admin/events";

type AdminApiErrorPayload = {
  code?: number | string;
};

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapAdminEvent(item: unknown, index: number): AdminEvent {
  const value = toRecord(item);

  const id =
    readString(value.id) ||
    readString(value.eventId) ||
    readString(value.uuid) ||
    `event-${index + 1}`;

  const title =
    readString(value.title) ||
    readString(value.name) ||
    readString(value.eventName) ||
    "Untitled event";

  const status =
    readString(value.status) ||
    readString(value.eventStatus) ||
    "PENDING_APPROVAL";

  return {
    id,
    title,
    description: readString(value.description) || readString(value.shortDescription) || undefined,
    location:
      readString(value.location) ||
      readString(value.venueName) ||
      readString(value.address) ||
      undefined,
    organizerName:
      readString(value.organizerName) ||
      readString(value.organizer) ||
      readString(value.organizerFullName) ||
      undefined,
    organizerId: readString(value.organizerId) || undefined,
    status,
    startTime: readString(value.startTime) || readString(value.startDate) || undefined,
    endTime: readString(value.endTime) || readString(value.endDate) || undefined,
    createdAt: readString(value.createdAt) || undefined,
    rejectReason: readString(value.rejectReason) || undefined,
    bannerUrl: readString(value.bannerUrl) || readString(value.image) || undefined,
    category: readString(value.category) || undefined,
  };
}

function parseAdminEventsPage(payload: unknown): AdminEventsPage {
  const raw = toRecord(payload);
  const rawItems =
    (Array.isArray(raw.items) && raw.items) ||
    (Array.isArray(raw.content) && raw.content) ||
    (Array.isArray(raw.results) && raw.results) ||
    (Array.isArray(raw.data) && raw.data) ||
    [];

  const mappedItems = rawItems.map((item, index) => mapAdminEvent(item, index));

  const page = readNumber(raw.page ?? raw.number, 0);
  const size = readNumber(raw.size, mappedItems.length || 10);
  const totalElements = readNumber(raw.totalElements ?? raw.total ?? mappedItems.length, mappedItems.length);
  const totalPages = readNumber(raw.totalPages, Math.max(1, Math.ceil(totalElements / Math.max(1, size))));

  return {
    items: mappedItems,
    page,
    size,
    totalElements,
    totalPages,
    hasNext: Boolean(raw.hasNext ?? (raw.last === false) ?? page + 1 < totalPages),
  };
}

export async function getAdminEvents(query: AdminEventsQuery): Promise<AdminEventsPage> {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>(ADMIN_EVENTS_ENDPOINT, {
      params: query,
    });

    ensureApiResultSuccess(response.data, "Không thể tải danh sách sự kiện.");
    const payload = getApiResultData(response.data as ApiResult<unknown>) ?? response.data;

    return parseAdminEventsPage(payload);
  } catch (error) {
    throw new Error(getAdminErrorMessage(error, "Không thể tải danh sách sự kiện."));
  }
}

export async function getAdminEventById(eventId: string): Promise<AdminEvent | null> {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>(`${ADMIN_EVENTS_ENDPOINT}/${eventId}`);
    ensureApiResultSuccess(response.data, "Không thể tải chi tiết sự kiện.");

    const payload = getApiResultData(response.data as ApiResult<unknown>) ?? response.data;
    return mapAdminEvent(payload, 0);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw new Error(getAdminErrorMessage(error, "Không thể tải chi tiết sự kiện."));
  }
}

export async function findAdminEventByIdFromList(eventId: string): Promise<AdminEvent | null> {
  const statuses: Array<AdminEventStatus | undefined> = ["PENDING_APPROVAL", "PUBLISHED", "REJECTED", undefined];

  for (const status of statuses) {
    const pageData = await getAdminEvents({ status, page: 0, size: 100 });
    const found = pageData.items.find((item) => item.id === eventId);

    if (found) {
      return found;
    }
  }

  return null;
}

export async function approveAdminEvent(eventId: string) {
  try {
    const response = await axiosClient.put<ApiResult<unknown>>(
      `${ADMIN_EVENTS_ENDPOINT}/${eventId}/approve`,
      {},
    );

    ensureApiResultSuccess(response.data, "Duyệt sự kiện thất bại.");
    const payload = getApiResultData(response.data as ApiResult<unknown>) ?? response.data;
    return payload ? mapAdminEvent(payload, 0) : null;
  } catch (error) {
    throw new Error(getAdminErrorMessage(error, "Duyệt sự kiện thất bại."));
  }
}

export async function rejectAdminEvent(eventId: string, rejectReason: string) {
  try {
    const response = await axiosClient.put<ApiResult<unknown>>(
      `${ADMIN_EVENTS_ENDPOINT}/${eventId}/reject`,
      { rejectReason },
    );

    ensureApiResultSuccess(response.data, "Từ chối sự kiện thất bại.");
    const payload = getApiResultData(response.data as ApiResult<unknown>) ?? response.data;
    return payload ? mapAdminEvent(payload, 0) : null;
  } catch (error) {
    throw new Error(getAdminErrorMessage(error, "Từ chối sự kiện thất bại."));
  }
}

export function isAdminForbiddenError(error: unknown) {
  if (!isAxiosError<AdminApiErrorPayload>(error)) {
    return false;
  }

  const responseCode = error.response?.data?.code;
  const normalizedCode = typeof responseCode === "string" ? Number(responseCode) : responseCode;

  return error.response?.status === 403 || normalizedCode === 1037;
}

export function getAdminErrorMessage(error: unknown, fallback: string) {
  if (isAdminForbiddenError(error)) {
    return "Bạn không có quyền quản trị";
  }

  return getApiErrorMessage(error, fallback);
}

// Public Events Listing (Published only)
export type PublicEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  organizerName?: string;
  organizerId?: string;
  status: string;
  startTime?: string;
  endTime?: string;
  bannerUrl?: string;
  category?: string;
  price?: number;
  attendeeCount?: number;
};

export type PublicEventsPage = {
  items: PublicEvent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type PublicEventsQuery = {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  size?: number;
  sortBy?: string;
};

function mapPublicEvent(item: unknown, index: number): PublicEvent {
  const value = toRecord(item);

  const id =
    readString(value.id) ||
    readString(value.eventId) ||
    readString(value.uuid) ||
    `event-${index + 1}`;

  const title =
    readString(value.title) ||
    readString(value.name) ||
    readString(value.eventName) ||
    "Untitled event";

  return {
    id,
    title,
    description: readString(value.description) || readString(value.shortDescription) || undefined,
    location: readString(value.location) || readString(value.venueName) || readString(value.address) || undefined,
    organizerName: readString(value.organizerName) || readString(value.organizer) || readString(value.organizerFullName) || undefined,
    organizerId: readString(value.organizerId) || undefined,
    status: readString(value.status) || "PUBLISHED",
    startTime: readString(value.startTime) || readString(value.startDate) || undefined,
    endTime: readString(value.endTime) || readString(value.endDate) || undefined,
    bannerUrl: readString(value.bannerUrl) || readString(value.image) || undefined,
    category: readString(value.category) || undefined,
    price: readNumber(value.price),
    attendeeCount: readNumber(value.attendeeCount),
  };
}

function parsePublicEventsPage(payload: unknown): PublicEventsPage {
  const raw = toRecord(payload);
  const rawItems =
    (Array.isArray(raw.items) && raw.items) ||
    (Array.isArray(raw.content) && raw.content) ||
    (Array.isArray(raw.results) && raw.results) ||
    (Array.isArray(raw.data) && raw.data) ||
    [];

  const mappedItems = rawItems.map((item, index) => mapPublicEvent(item, index));

  const page = readNumber(raw.page ?? raw.number, 0);
  const size = readNumber(raw.size, mappedItems.length || 10);
  const totalElements = readNumber(raw.totalElements ?? raw.total ?? mappedItems.length, mappedItems.length);
  const totalPages = readNumber(raw.totalPages, Math.max(1, Math.ceil(totalElements / Math.max(1, size))));

  return {
    items: mappedItems,
    page,
    size,
    totalElements,
    totalPages,
    hasNext: Boolean(raw.hasNext ?? (raw.last === false) ?? page + 1 < totalPages),
  };
}

export async function getPublicEvents(query: PublicEventsQuery): Promise<PublicEventsPage> {
  try {
    const response = await axiosClient.get<ApiResult<unknown>>("/api/events", {
      params: query,
    });

    ensureApiResultSuccess(response.data, "Không thể tải danh sách sự kiện.");
    const payload = getApiResultData(response.data as ApiResult<unknown>) ?? response.data;

    return parsePublicEventsPage(payload);
  } catch (error) {
    throw new Error(getAdminErrorMessage(error, "Không thể tải danh sách sự kiện."));
  }
}
