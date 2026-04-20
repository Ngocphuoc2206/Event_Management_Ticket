import Head from "next/head";

import {
  OrganizerDashboardSidebar,
  OrganizerEventsContent,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerEventsPage() {
  return (
    <>
      <Head>
        <title>Organizer Events | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Events")}
            profile={organizerProfile}
          />
          <OrganizerEventsContent />
        </div>
      </main>
    </>
  );
}
