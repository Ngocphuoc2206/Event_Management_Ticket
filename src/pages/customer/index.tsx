import Head from "next/head";
import { useRouter } from "next/router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CustomerDashboardContent,
  CustomerDashboardSidebar,
  customerNavigationItems,
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

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col xl:flex-row">
          <CustomerDashboardSidebar
            navigationItems={customerNavigationItems}
            profile={customerProfile}
            onLogout={() => void handleLogout()}
          />
          <CustomerDashboardContent
            customerName={customerProfile.name}
            statCards={customerStatCards}
            upcomingTickets={customerUpcomingTickets}
            recentOrders={customerRecentOrders}
          />
        </div>
      </main>
    </>
  );
}
