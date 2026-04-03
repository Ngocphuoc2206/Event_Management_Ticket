import Head from "next/head";

import {
  OrganizerCreateEventStepThreeContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerCreateEventVisualsPage() {
  return (
    <>
      <Head>
        <title>Create Event - Visuals | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Create Event")}
            profile={organizerProfile}
          />
          <OrganizerCreateEventStepThreeContent />
        </div>
      </main>
    </>
  );
}
