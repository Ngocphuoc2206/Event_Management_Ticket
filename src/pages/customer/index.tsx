import Head from "next/head";
import { useRouter } from "next/router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CustomerDashboardContent,
  CustomerPageShell,
  customerProfile,
  customerRecentOrders,
  customerStatCards,
  customerUpcomingTickets,
} from "@/features/customer";

export default function CustomerDashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    void router.push(result.redirectTo);
  };

  return (
    <>
      <Head>
        <title>Customer Dashboard | EventHub</title>
      </Head>

      <CustomerPageShell activeHref="/customer" onLogout={() => void handleLogout()}>
        <CustomerDashboardContent
          customerName={customerProfile.name}
          statCards={customerStatCards}
          upcomingTickets={customerUpcomingTickets}
          recentOrders={customerRecentOrders}
        />
      </CustomerPageShell>
    </>
  );
}
