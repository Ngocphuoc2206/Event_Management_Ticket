import type { ApiResult } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const PAYMENTS_ENDPOINT =
  process.env.NEXT_PUBLIC_PAYMENTS_ENDPOINT || "/api/payments";

export type PaymentMethod = "MOCK";

export type InitPaymentPayload = {
  orderId: string;
  method: PaymentMethod;
};

export type PaymentResponse = {
  paymentId: string;
  orderId: string;
  amount: number;
  method: PaymentMethod | string;
  provider: string;
  status: string;
  paymentUrl?: string;
  providerTransactionId?: string;
  clientSecret?: string;
  createdAt?: string;
  expiredAt?: string;
};

export type PaymentWebhookStatus = "SUCCESS" | "FAILED";

export type PaymentWebhookMockPayload = {
  paymentId: string;
  orderId: string;
  providerTransactionId: string;
  provider: string;
  status: PaymentWebhookStatus;
  amount: number;
  signature: string;
  eventId: string;
  rawData: string;
};

export type PaymentWebhookMockResponse = {
  success: boolean;
  message: string;
};

export async function initPayment(payload: InitPaymentPayload) {
  const response = await axiosClient.post<ApiResult<PaymentResponse>>(
    `${PAYMENTS_ENDPOINT}/init`,
    payload,
  );

  return getApiResultData<PaymentResponse>(response.data);
}

export async function mockPaymentWebhook(payload: PaymentWebhookMockPayload) {
  const response = await axiosClient.post<ApiResult<PaymentWebhookMockResponse>>(
    `${PAYMENTS_ENDPOINT}/webhook/mock`,
    payload,
    {
      headers: {
        "X-Skip-Auth": "true",
      },
    },
  );

  return getApiResultData<PaymentWebhookMockResponse>(response.data);
}
