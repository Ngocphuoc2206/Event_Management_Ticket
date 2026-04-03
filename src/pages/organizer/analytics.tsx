import Head from "next/head";

import {
  OrganizerAnalyticsContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Organizer Analytics | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Analytics")}
            profile={organizerProfile}
          />
          <OrganizerAnalyticsContent />
        </div>
      </main>
    </>
  );
}
