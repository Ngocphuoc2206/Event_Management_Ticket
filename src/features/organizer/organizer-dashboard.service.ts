/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrganizerEvents } from "@/features/organizer/events/services/create-event.service";
import type { OrganizerOrderRow, OrganizerStatCard } from "./types";

type DashboardStats = {
  totalEvents: number;
  ticketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
};

function formatCurrency(value: number) {
  if (!value) return "0 VND";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  try {
    const pageData = await getOrganizerEvents({
      page: 0,
      size: 100,
    });

    const events = pageData.items || [];
    const now = new Date();

    const totalEvents = events.length;

    const ticketsSold = events.reduce((sum, event: any) => {
      const totalTickets = Number(event.totalTickets || 0);
      const availableTickets = Number(event.availableTickets || 0);
      return sum + Math.max(totalTickets - availableTickets, 0);
    }, 0);

    const totalRevenue = events.reduce((sum, event: any) => {
      const minPrice = Number(event.minPrice || 0);
      const totalTickets = Number(event.totalTickets || 0);
      const availableTickets = Number(event.availableTickets || 0);
      const sold = Math.max(totalTickets - availableTickets, 0);

      return sum + sold * minPrice;
    }, 0);

    const upcomingEvents = events.filter((event: any) => {
      const startTime = event.startTime || event.date;
      if (!startTime) return false;

      return new Date(startTime).getTime() >= now.getTime();
    }).length;

    return {
      totalEvents,
      ticketsSold,
      totalRevenue,
      upcomingEvents,
    };
  } catch (error) {
    console.error("[Dashboard Service] Failed to fetch stats:", error);
    return null;
  }
}

export async function fetchRecentOrders(): Promise<OrganizerOrderRow[] | null> {
  return [];
}

export function transformStatsToCards(
  stats: DashboardStats,
): OrganizerStatCard[] {
  return [
    {
      label: "Total Events",
      value: String(stats.totalEvents),
      icon: "ticket",
      tone: "sky",
      badgeText: "From backend",
    },
    {
      label: "Tickets Sold",
      value: stats.ticketsSold.toLocaleString("vi-VN"),
      icon: "calendar",
      tone: "violet",
      badgeText: "Calculated",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: "analytics",
      tone: "rose",
      badgeText: "Estimated",
    },
    {
      label: "Upcoming Events",
      value: String(stats.upcomingEvents),
      icon: "events",
      tone: "slate",
      showStackedDots: true,
    },
  ];
}
