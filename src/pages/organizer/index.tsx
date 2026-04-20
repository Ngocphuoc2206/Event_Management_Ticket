import Head from "next/head";

import {
  OrganizerDashboardContent,
  OrganizerLayout,
  organizerRecentOrders,
  organizerStatCards,
} from "@/features/organizer";

export default function OrganizerDashboardPage() {
  return (
    <>
      <Head>
        <title>Organizer Dashboard | EventHub</title>
      </Head>

      <OrganizerLayout title="Dashboard Overview" activeLabel="Dashboard">
        <OrganizerDashboardContent statCards={organizerStatCards} recentOrders={organizerRecentOrders} />
      </OrganizerLayout>
    </>
  );
}
