import Head from "next/head";

import {
  OrganizerCreateEventContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerCreateEventPage() {
  return (
    <>
      <Head>
        <title>Create Event | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Create Event")}
            profile={organizerProfile}
          />
          <OrganizerCreateEventContent />
        </div>
      </main>
    </>
  );
}
