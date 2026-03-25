import axios from "axios";

import { DEFAULT_API_BASE_URL } from "@/features/auth/constants";
import { getStoredAccessToken } from "@/features/auth/utils";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const skipAuth = config.headers?.["X-Skip-Auth"] === "true";

  if (skipAuth && config.headers) {
    delete config.headers["X-Skip-Auth"];
  }

  if (!skipAuth) {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosClient;
