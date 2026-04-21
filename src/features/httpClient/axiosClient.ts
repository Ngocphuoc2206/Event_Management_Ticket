import axios from "axios";

import { DEFAULT_API_BASE_URL } from "@/features/auth/constants";
import { getStoredAccessToken } from "@/features/auth/utils";

const AUTH_COOKIE_KEYS = ["accessToken", "token", "authToken"];

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getStoredAuthToken() {
  const localStorageToken = getStoredAccessToken();
  if (localStorageToken) {
    return localStorageToken;
  }

  for (const cookieKey of AUTH_COOKIE_KEYS) {
    const cookieToken = getCookieValue(cookieKey);
    if (cookieToken) {
      return cookieToken;
    }
  }

  return null;
}

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINT_PATTERNS = [
  /^\/api\/auth\/register(?:$|[/?#])/,
  /^\/api\/auth\/login(?:$|[/?#])/,
  /^\/api\/auth\/refresh(?:$|[/?#])/,
  /^\/api\/events(?:$|[/?#])/,
  /^\/api\/events\//,
  /^\/api\/payments\/webhook(?:$|[/?#])/,
  /^\/api\/payments\/webhook\//,
];

function isPublicEndpoint(url?: string) {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.startsWith("http")
    ? new URL(url).pathname
    : url;

  return PUBLIC_ENDPOINT_PATTERNS.some((pattern) => pattern.test(normalizedUrl));
}

axiosClient.interceptors.request.use((config) => {
  const skipAuth =
    config.headers?.["X-Skip-Auth"] === "true" || isPublicEndpoint(config.url);

  if (skipAuth && config.headers) {
    delete config.headers["X-Skip-Auth"];
  }

  if (!skipAuth) {
    const token = getStoredAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
