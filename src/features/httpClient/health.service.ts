import axiosClient from "@/features/httpClient/axiosClient";

export async function checkBackendHealth() {
  const response = await axiosClient.get("/api/health");

  return response.data;
}
