import type { ApiResult } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
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

export async function createOrder(payload: CreateOrderPayload) {
  const response = await axiosClient.post<ApiResult<OrderResponse>>(
    ORDERS_ENDPOINT,
    payload,
  );

  return getApiResultData<OrderResponse>(response.data);
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
