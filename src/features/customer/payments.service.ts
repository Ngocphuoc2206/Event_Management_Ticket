import type { ApiResult } from "@/features/auth/types";
import {
  ensureApiResultSuccess,
  getApiErrorMessage,
  getApiResultData,
} from "@/features/auth/utils";
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

function normalizePaymentResponse(payload: unknown): PaymentResponse | null {
  if (!isRecord(payload)) {
    return null;
  }

  const paymentId = getStringValue(payload, ["paymentId", "id"]);
  const orderId = getStringValue(payload, ["orderId"]);

  if (!paymentId || !orderId) {
    return null;
  }

  return {
    paymentId,
    orderId,
    amount: getNumberValue(payload, ["amount"]),
    method: getStringValue(payload, ["method"]) || "MOCK",
    provider: getStringValue(payload, ["provider"]) || "MOCK_GATEWAY",
    status: getStringValue(payload, ["status"]) || "PENDING",
    paymentUrl: getStringValue(payload, ["paymentUrl", "paymentURL"]),
    providerTransactionId: getStringValue(payload, [
      "providerTransactionId",
    ]),
    clientSecret: getStringValue(payload, ["clientSecret"]),
    createdAt: getStringValue(payload, ["createdAt"]),
    expiredAt: getStringValue(payload, ["expiredAt", "expiredTime"]),
  };
}

function normalizeWebhookResponse(payload: unknown): PaymentWebhookMockResponse | null {
  if (!isRecord(payload)) {
    return null;
  }

  return {
    success: Boolean(payload.success),
    message: getStringValue(payload, ["message"]) || "Webhook processed successfully",
  };
}

export async function initPayment(payload: InitPaymentPayload) {
  try {
    const response = await axiosClient.post<ApiResult<PaymentResponse>>(
      `${PAYMENTS_ENDPOINT}/init`,
      payload,
    );

    ensureApiResultSuccess(response.data, "Could not initialize payment.");
    return normalizePaymentResponse(getApiResultData<PaymentResponse>(response.data));
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Could not initialize payment."));
  }
}

export async function mockPaymentWebhook(payload: PaymentWebhookMockPayload) {
  try {
    const response = await axiosClient.post<ApiResult<PaymentWebhookMockResponse>>(
      `${PAYMENTS_ENDPOINT}/webhook/mock`,
      payload,
      {
        headers: {
          "X-Skip-Auth": "true",
        },
      },
    );

    ensureApiResultSuccess(response.data, "Could not process payment callback.");
    return normalizeWebhookResponse(
      getApiResultData<PaymentWebhookMockResponse>(response.data),
    );
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Could not process payment callback."),
    );
  }
}
