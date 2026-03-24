import Head from "next/head";

import {
  OrganizerDashboardContent,
  OrganizerDashboardSidebar,
  organizerNavigationItems,
  organizerRecentOrders,
  organizerProfile,
  organizerStatCards,
} from "@/features/organizer";

export default function OrganizerDashboardPage() {
  return (
    <>
      <Head>
        <title>Organizer Dashboard | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#eef2f8] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar navigationItems={organizerNavigationItems} profile={organizerProfile} />
          <OrganizerDashboardContent statCards={organizerStatCards} recentOrders={organizerRecentOrders} />
        </div>
      </main>
    </>
  );
}
