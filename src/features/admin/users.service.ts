import type { ApiResult, UserRole } from "@/features/auth/types";
import { getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const ADMIN_USERS_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT || "/auth/admin/users";

export type AdminUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole | null;
  status?: AdminUserStatus | string | null;
};

export async function getAdminUsers() {
  const response = await axiosClient.get<ApiResult<AdminUser[]>>(
    ADMIN_USERS_ENDPOINT,
  );

  return getApiResultData<AdminUser[]>(response.data) ?? [];
}

export async function getAdminUser(userId: string) {
  const response = await axiosClient.get<ApiResult<AdminUser>>(
    `${ADMIN_USERS_ENDPOINT}/${userId}`,
  );

  return getApiResultData<AdminUser>(response.data);
}

export async function updateAdminUserStatus(
  userId: string,
  status: AdminUserStatus,
) {
  const response = await axiosClient.patch<ApiResult<AdminUser>>(
    `${ADMIN_USERS_ENDPOINT}/${userId}/status`,
    { status },
  );

  return getApiResultData<AdminUser>(response.data);
}

// Dashboard Reports & Statistics
export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  publishedEvents: number;
  pendingApprovalEvents: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalTicketsSold: number;
};

export type RevenueReport = {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue?: number;
  topEvents?: Array<{
    eventId: string;
    eventTitle: string;
    revenue: number;
  }>;
};

export type UserReport = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  customerCount: number;
  organizerCount: number;
  adminCount: number;
  newUsersThisMonth: number;
};

export type EventReport = {
  totalEvents: number;
  publishedEvents: number;
  pendingApprovalEvents: number;
  rejectedEvents: number;
  totalAttendees: number;
  averageAttendeesPerEvent: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await axiosClient.get<ApiResult<DashboardStats>>("/api/admin/stats");
    return getApiResultData<DashboardStats>(response.data) ?? {
      totalUsers: 0,
      activeUsers: 0,
      totalEvents: 0,
      publishedEvents: 0,
      pendingApprovalEvents: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalTicketsSold: 0,
    };
  } catch {
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalEvents: 0,
      publishedEvents: 0,
      pendingApprovalEvents: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalTicketsSold: 0,
    };
  }
}

export async function getRevenueReport(): Promise<RevenueReport> {
  try {
    const response = await axiosClient.get<ApiResult<RevenueReport>>("/api/admin/reports/revenue");
    return getApiResultData<RevenueReport>(response.data) ?? {
      totalRevenue: 0,
      monthlyRevenue: 0,
    };
  } catch {
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
    };
  }
}

export async function getUserReport(): Promise<UserReport> {
  try {
    const response = await axiosClient.get<ApiResult<UserReport>>("/api/admin/reports/users");
    return getApiResultData<UserReport>(response.data) ?? {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      customerCount: 0,
      organizerCount: 0,
      adminCount: 0,
      newUsersThisMonth: 0,
    };
  } catch {
    return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      customerCount: 0,
      organizerCount: 0,
      adminCount: 0,
      newUsersThisMonth: 0,
    };
  }
}

export async function getEventReport(): Promise<EventReport> {
  try {
    const response = await axiosClient.get<ApiResult<EventReport>>("/api/admin/reports/events");
    return getApiResultData<EventReport>(response.data) ?? {
      totalEvents: 0,
      publishedEvents: 0,
      pendingApprovalEvents: 0,
      rejectedEvents: 0,
      totalAttendees: 0,
      averageAttendeesPerEvent: 0,
    };
  } catch {
    return {
      totalEvents: 0,
      publishedEvents: 0,
      pendingApprovalEvents: 0,
      rejectedEvents: 0,
      totalAttendees: 0,
      averageAttendeesPerEvent: 0,
    };
  }
}
