/* eslint-disable @typescript-eslint/no-explicit-any */
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CustomerDashboardContent,
  CustomerPageShell,
} from "@/features/customer";
import { getMyTickets } from "@/features/customer/tickets.service";
import { getMyOrders } from "@/features/customer/orders.service";
import axiosClient from "@/features/httpClient/axiosClient";
import { getApiResultData } from "@/features/auth/utils";

function formatDateTime(value?: string) {
  if (!value) return "Updating soon";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrency(value?: number) {
  if (!value) return "Free Ticket";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CustomerDashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("Customer");
  const [upcomingTickets, setUpcomingTickets] = useState<any[]>([]);
  const [pastTickets, setPastTickets] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const [profileRes, upcoming, past, ordersRes] = await Promise.all([
          axiosClient.get("/api/auth/users/me"),
          getMyTickets({ type: "upcoming" }),
          getMyTickets({ type: "past" }),
          getMyOrders(),
        ]);
        console.log("DASHBOARD UPCOMING TICKETS:", upcoming);

        if (!mounted) return;

        const profile = getApiResultData<any>(profileRes.data);
        setCustomerName(
          profile?.fullName || profile?.name || profile?.email || "Customer",
        );

        setUpcomingTickets(
          upcoming.slice(0, 2).map((ticket) => ({
            status: ticket.used ? "Used" : "Upcoming",
            title: ticket.eventTitle || ticket.eventName || "Untitled Event",
            date: formatDateTime(
              ticket.eventStartTime || ticket.startTime || ticket.eventDate,
            ),
            venue:
              ticket.venueName ||
              ticket.venue ||
              ticket.location ||
              [ticket.address, ticket.city].filter(Boolean).join(", ") ||
              "Venue pending",
            ticketCode: ticket.ticketCode || ticket.code || ticket.id,
            qrCodeUrl:
              ticket.qrCodeUrl ||
              ticket.qrImageUrl ||
              ticket.qrPublicUrl ||
              ticket.qrCode ||
              "",
            palette: "from-white via-white to-slate-100",
            artTitle: "EVENTHUB",
            imageSrc:
              ticket.eventBannerUrl || "/images/default-event-banner.jpg",
          })),
        );

        setPastTickets(past);

        setRecentOrders(
          (ordersRes.items || []).slice(0, 5).map((order) => ({
            id: order.id,
            event: order.items?.[0]?.ticketTypeName || "Order",
            date: formatDateTime(order.orderDate),
            amount: formatCurrency(order.totalAmount),
            status: order.status === "PAID" ? "Completed" : "Pending",
          })),
        );
      } catch (error) {
        console.error("Cannot load customer dashboard:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Total Tickets",
        value: String(upcomingTickets.length + pastTickets.length),
        note: "All tickets you purchased",
        accent: "text-blue-600",
        icon: "ticket",
      },
      {
        label: "Upcoming Events",
        value: String(upcomingTickets.length),
        note: upcomingTickets[0]?.date
          ? `Next: ${upcomingTickets[0].date}`
          : "No upcoming ticket",
        accent: "text-violet-600",
        icon: "calendar",
      },
      {
        label: "Past Events",
        value: String(pastTickets.length),
        note: "Events you attended",
        accent: "text-rose-600",
        icon: "history",
      },
      {
        label: "Recent Orders",
        value: String(recentOrders.length),
        note: "Latest order history",
        accent: "text-blue-600",
        icon: "star",
      },
    ],
    [upcomingTickets, pastTickets, recentOrders],
  );

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  return (
    <>
      <Head>
        <title>Customer Dashboard | EventHub</title>
      </Head>

      <CustomerPageShell
        activeHref="/customer"
        onLogout={() => void handleLogout()}
      >
        {isLoading ? (
          <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-500">
            Loading dashboard...
          </div>
        ) : (
          <CustomerDashboardContent
            customerName={customerName}
            statCards={statCards as any}
            upcomingTickets={upcomingTickets}
            recentOrders={recentOrders}
          />
        )}
      </CustomerPageShell>
    </>
  );
}
