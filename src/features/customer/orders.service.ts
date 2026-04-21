import type { ApiResult } from "@/features/auth/types";
import {
  ensureApiResultSuccess,
  getApiErrorMessage,
  getApiResultData,
} from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const ORDERS_ENDPOINT = process.env.NEXT_PUBLIC_ORDERS_ENDPOINT || "/api/orders";
const MY_ORDERS_ENDPOINT =
  process.env.NEXT_PUBLIC_MY_ORDERS_ENDPOINT || "/api/orders/me";

export type OrderItemResponse = {
  id: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice?: number;
  lineTotal?: number;
  subTotal?: number;
};

export type OrderResponse = {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  userName?: string;
  items: OrderItemResponse[];
};

export type MyOrdersResponse = {
  hasNext: boolean;
  items: OrderResponse[];
};

export type CreateOrderItemPayload = {
  ticketTypeId: string;
  quantity: number;
};

export type CreateOrderPayload = {
  items: CreateOrderItemPayload[];
};

export type GetMyOrdersParams = {
  search?: string;
  orderStatus?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getNumberValue(record: Record<string, unknown>, keys: string[]) {
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

function normalizeOrderItem(payload: unknown): OrderItemResponse | null {
  if (!isRecord(payload)) {
    return null;
  }

  const id = getStringValue(payload, ["id"]);
  const ticketTypeId = getStringValue(payload, ["ticketTypeId"]);

  if (!ticketTypeId) {
    return null;
  }

  return {
    id: id || ticketTypeId,
    ticketTypeId,
    ticketTypeName: getStringValue(payload, ["ticketTypeName", "name"]),
    quantity: getNumberValue(payload, ["quantity"]),
    unitPrice: getNumberValue(payload, ["unitPrice", "price"]),
    lineTotal: getNumberValue(payload, ["lineTotal"]),
    subTotal: getNumberValue(payload, ["subTotal"]),
  };
}

function normalizeOrder(payload: unknown): OrderResponse | null {
  if (!isRecord(payload)) {
    return null;
  }

  const id = getStringValue(payload, ["id", "orderId"]);
  if (!id) {
    return null;
  }

  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  return {
    id,
    orderDate: getStringValue(payload, ["orderDate", "createdAt"]),
    totalAmount: getNumberValue(payload, ["totalAmount", "amount"]),
    status: getStringValue(payload, ["status"]) || "PENDING_PAYMENT",
    paymentStatus: getStringValue(payload, ["paymentStatus"]),
    userName: getStringValue(payload, ["userName", "customerName"]),
    items: rawItems
      .map(normalizeOrderItem)
      .filter((item): item is OrderItemResponse => item !== null),
  };
}

export async function createOrder(payload: CreateOrderPayload) {
  const sanitizedItems = payload.items
    .map((item) => ({
      ticketTypeId: item.ticketTypeId.trim(),
      quantity: Math.floor(item.quantity),
    }))
    .filter((item) => item.ticketTypeId.length > 0);

  if (sanitizedItems.length === 0) {
    throw new Error("Please select at least one valid ticket type.");
  }

  if (sanitizedItems.some((item) => item.quantity <= 0)) {
    throw new Error("Ticket quantity must be greater than 0.");
  }

  try {
    const response = await axiosClient.post<ApiResult<OrderResponse>>(
      ORDERS_ENDPOINT,
      { items: sanitizedItems },
    );

    ensureApiResultSuccess(response.data, "Could not create order.");
    return normalizeOrder(getApiResultData<OrderResponse>(response.data));
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Could not create order."));
  }
}

export async function getMyOrders(params?: GetMyOrdersParams) {
  const response = await axiosClient.get<ApiResult<MyOrdersResponse>>(
    MY_ORDERS_ENDPOINT,
    {
      params: {
        ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params?.orderStatus ? { orderStatus: params.orderStatus } : {}),
      },
    },
  );

  return (
    getApiResultData<MyOrdersResponse>(response.data) ?? {
      hasNext: false,
      items: [],
    }
  );
}

export async function getMyOrder(orderId: string) {
  const response = await axiosClient.get<ApiResult<OrderResponse>>(
    `${ORDERS_ENDPOINT}/${orderId}/me`,
  );

  return getApiResultData<OrderResponse>(response.data);
}
