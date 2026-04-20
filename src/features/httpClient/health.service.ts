import { BACKEND_HEALTH_ENDPOINT } from "@/features/auth/constants";
import axiosClient from "@/features/httpClient/axiosClient";

export async function checkBackendHealth() {
  const response = await axiosClient.get(BACKEND_HEALTH_ENDPOINT);

  return response.data;
}
