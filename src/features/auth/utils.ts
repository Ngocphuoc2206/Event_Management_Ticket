import { isAxiosError } from "axios";

import { AUTH_REDIRECT_ROUTES, AUTH_STORAGE_KEYS } from "@/features/auth/constants";
import type {
  ApiResponse,
  ApiResult,
  AuthPayload,
  AuthSession,
  UserRole,
} from "@/features/auth/types";

const AUTH_PERSISTED_KEYS = Object.values(AUTH_STORAGE_KEYS);

function expireCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}

export function isApiResponse<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return typeof response === "object" && response !== null && !Array.isArray(response);
}

export function getApiResultData<T>(response: ApiResult<T>): T | undefined {
  if (!isApiResponse(response)) {
    return response;
  }

  return response.results ?? response.result ?? response.data;
}

export function getApiResultMessage<T>(response: ApiResult<T>): string | undefined {
  if (!isApiResponse(response)) {
    return undefined;
  }

  return response.message;
}

export function getApiErrorMessage<T>(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiResponse<T> | string>(error)) {
    return fallback;
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === "object" && "message" in responseData) {
    const message = responseData.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

function normalizeRole(role?: string | null): UserRole | undefined {
  if (role === "CUSTOMER" || role === "ORGANIZER" || role === "ADMIN") {
    return role;
  }

  return undefined;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );

    return JSON.parse(window.atob(paddedPayload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function resolveAuthPayload(
  payload?: AuthPayload,
  options?: { fallbackRole?: UserRole },
): AuthPayload | undefined {
  if (!payload) {
    return undefined;
  }

  const resolvedPayload: AuthPayload = { ...payload };

  if (payload.accessToken) {
    const claims = decodeJwtPayload(payload.accessToken);
    const subject = claims?.sub;
    const role = claims?.role;

    if (!resolvedPayload.id && typeof subject === "string") {
      resolvedPayload.id = subject;
    }

    if (!resolvedPayload.role && typeof role === "string") {
      resolvedPayload.role = normalizeRole(role);
    }
  }

  if (!resolvedPayload.role && options?.fallbackRole) {
    resolvedPayload.role = options.fallbackRole;
  }

  return resolvedPayload;
}

export function createAuthSession(
  payload?: AuthPayload,
  options?: { fallbackRole?: UserRole },
): AuthSession | null {
  const resolvedPayload = resolveAuthPayload(payload, options);

  if (!resolvedPayload) {
    return null;
  }

  return {
    id: resolvedPayload.id ?? null,
    fullName: resolvedPayload.fullName ?? null,
    email: resolvedPayload.email ?? null,
    phone: resolvedPayload.phone ?? null,
    role: resolvedPayload.role ?? null,
    accessToken: resolvedPayload.accessToken ?? null,
    refreshToken: resolvedPayload.refreshToken ?? null,
  };
}

export function persistAuthSession(payload?: AuthPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const session = createAuthSession(payload);

  if (!session?.accessToken) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.accessToken);

  if (session.refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refreshToken);
  }

  if (session.role) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userRole, session.role);
  }
}

export function persistResolvedAuthSession(session?: AuthSession | null) {
  if (typeof window === "undefined" || !session?.accessToken) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.accessToken);

  if (session.refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refreshToken);
  }

  if (session.role) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userRole, session.role);
  }
}

export function clearPersistedAuth() {
  if (typeof window === "undefined") {
    return;
  }

  AUTH_PERSISTED_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    expireCookie(key);
  });
}

export function getPostAuthRoute(role?: UserRole) {
  return role ? AUTH_REDIRECT_ROUTES[role] : "/";
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.userRole);
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
}
