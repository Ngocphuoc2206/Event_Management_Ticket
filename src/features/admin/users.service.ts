import type { ApiResult, UserRole } from "@/features/auth/types";
import { ensureApiResultSuccess, getApiResultData } from "@/features/auth/utils";
import axiosClient from "@/features/httpClient/axiosClient";

const ADMIN_USERS_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT || "http://localhost:8080/api/admin/users";

export type AdminUserStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole | null;
  status?: AdminUserStatus | string | null;
};

export type AdminUsersPage = {
  items: AdminUser[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
};

type UnknownRecord = Record<string, unknown>;

function toRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object"
    ? (value as UnknownRecord)
    : {};
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapAdminUser(value: unknown): AdminUser {
  const raw = toRecord(value);

  return {
    id: readString(raw.id) || readString(raw.userId),
    fullName:
      readString(raw.fullName) ||
      readString(raw.name) ||
      "Unknown User",
    email: readString(raw.email),
    phone: readString(raw.phone),
    role: (readString(raw.role) as UserRole) || null,
    status: readString(raw.status) || "ACTIVE",
  };
}

function parseAdminUsersPage(payload: unknown): AdminUsersPage {
  const raw = toRecord(payload);
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items = rawItems.map((item) => mapAdminUser(item));

  return {
    items,
    page: readNumber(raw.page, 0),
    size: readNumber(raw.size, items.length || 10),
    totalItems: readNumber(raw.totalItems, items.length),
    totalPages: readNumber(raw.totalPages, 1),
    hasNext: Boolean(raw.hasNext),
  };
}

export async function getAdminUsers(params?: { page?: number; size?: number }) {
  const response = await axiosClient.get<ApiResult<unknown>>(ADMIN_USERS_ENDPOINT, {
    params,
  });

  ensureApiResultSuccess(response.data, "Cannot load admin users.");
  const payload = getApiResultData<unknown>(response.data);
  return parseAdminUsersPage(payload);
}

export async function getAllAdminUsers() {
  const pageData = await getAdminUsers({ page: 0, size: 100 });
  return pageData.items;
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
    const [usersPage, pendingEventsResponse, publicEventsResponse] =
      await Promise.all([
        getAdminUsers({ page: 0, size: 200 }),
        axiosClient.get<ApiResult<unknown>>("/api/admin/events/pending", {
          params: { page: 0, size: 1 },
        }),
        axiosClient.get<ApiResult<unknown>>("/api/events", {
          params: { page: 0, size: 1 },
        }),
      ]);

    const pendingPayload = toRecord(
      getApiResultData<unknown>(pendingEventsResponse.data),
    );
    const publicPayload = toRecord(getApiResultData<unknown>(publicEventsResponse.data));

    const activeUsers = usersPage.items.filter(
      (user) => readString(user.status) === "ACTIVE",
    ).length;
    const pendingApprovalEvents = readNumber(pendingPayload.totalItems, 0);
    const publishedEvents = readNumber(publicPayload.totalItems, 0);

    return {
      totalUsers: usersPage.totalItems,
      activeUsers,
      totalEvents: publishedEvents + pendingApprovalEvents,
      publishedEvents,
      pendingApprovalEvents,
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
    const stats = await getDashboardStats();
    return {
      totalRevenue: stats.totalRevenue,
      monthlyRevenue: stats.monthlyRevenue,
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
    const users = await getAllAdminUsers();
    const activeUsers = users.filter((user) => readString(user.status) === "ACTIVE").length;
    const inactiveUsers = users.filter((user) => readString(user.status) === "INACTIVE").length;
    const customerCount = users.filter((user) => readString(user.role) === "CUSTOMER").length;
    const organizerCount = users.filter((user) => readString(user.role) === "ORGANIZER").length;
    const adminCount = users.filter((user) => readString(user.role) === "ADMIN").length;

    return {
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,
      customerCount,
      organizerCount,
      adminCount,
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
    const stats = await getDashboardStats();
    return {
      totalEvents: stats.totalEvents,
      publishedEvents: stats.publishedEvents,
      pendingApprovalEvents: stats.pendingApprovalEvents,
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
