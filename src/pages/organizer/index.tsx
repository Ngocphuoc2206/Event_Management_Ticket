import Head from "next/head";

import {
  OrganizerDashboardContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
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

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Dashboard")}
            profile={organizerProfile}
          />
          <OrganizerDashboardContent statCards={organizerStatCards} recentOrders={organizerRecentOrders} />
        </div>
      </main>
    </>
  );
}
