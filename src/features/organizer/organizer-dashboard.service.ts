import axiosClient from "@/features/httpClient/axiosClient";
import type { OrganizerOrderRow, OrganizerStatCard } from "./types";

interface DashboardStats {
  totalEvents: number;
  ticketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  eventName: string;
  ticketType: "VIP" | "Standard";
  amount: string;
  status: "Completed" | "Pending";
}

/**
 * Fetch organizer dashboard statistics
 * GET /api/organizer/dashboard/stats
 */
export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await axiosClient.get<DashboardStats>("/api/organizer/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("[Dashboard Service] Failed to fetch stats:", error);
    return null;
  }
}

/**
 * Fetch organizer recent orders
 * GET /api/organizer/dashboard/orders
 */
export async function fetchRecentOrders(): Promise<Order[] | null> {
  try {
    const response = await axiosClient.get<Order[]>("/api/organizer/dashboard/orders");
    return response.data;
  } catch (error) {
    console.error("[Dashboard Service] Failed to fetch orders:", error);
    return null;
  }
}

/**
 * Transform dashboard stats to stat cards format
 */
export function transformStatsToCards(stats: DashboardStats): OrganizerStatCard[] {
  return [
    {
      label: "Total Events",
      value: stats.totalEvents.toString(),
      icon: "ticket",
      tone: "sky",
      badgeText: stats.totalEvents > 20 ? "+2 this month" : "Active",
    },
    {
      label: "Tickets Sold",
      value: stats.ticketsSold.toLocaleString(),
      icon: "calendar",
      tone: "violet",
      badgeText: "+12% vs last\nweek",
      badgeMultiLine: true,
    },
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}k`,
      icon: "analytics",
      tone: "rose",
      badgeText: "Record high",
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      icon: "events",
      tone: "slate",
      showStackedDots: true,
    },
  ];
}
