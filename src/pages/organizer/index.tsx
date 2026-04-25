import { useEffect, useState } from "react";
import Head from "next/head";

import {
  OrganizerDashboardContent,
  OrganizerLayout,
  organizerRecentOrders,
  organizerStatCards,
} from "@/features/organizer";
import { fetchDashboardStats, fetchRecentOrders, transformStatsToCards } from "@/features/organizer/organizer-dashboard.service";
import type { OrganizerOrderRow, OrganizerStatCard } from "@/features/organizer/types";

export default function OrganizerDashboardPage() {
  const [statCards, setStatCards] = useState<OrganizerStatCard[]>(organizerStatCards);
  const [recentOrders, setRecentOrders] = useState<OrganizerOrderRow[]>(organizerRecentOrders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch stats and orders in parallel
        const [stats, orders] = await Promise.all([fetchDashboardStats(), fetchRecentOrders()]);

        // Update stat cards if stats fetch succeeded
        if (stats) {
          const transformedCards = transformStatsToCards(stats);
          setStatCards(transformedCards);
        }

        // Update orders if orders fetch succeeded
        if (orders) {
          setRecentOrders(orders);
        }
      } catch (error) {
        console.error("[Organizer Dashboard] Error loading data:", error);
        // Keep mock data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <>
      <Head>
        <title>Organizer Dashboard | EventHub</title>
      </Head>

      <OrganizerLayout title="Dashboard Overview" activeLabel="Dashboard">
        <OrganizerDashboardContent statCards={statCards} recentOrders={recentOrders} />
      </OrganizerLayout>
    </>
  );
}
