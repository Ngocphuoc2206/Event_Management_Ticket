import Head from "next/head";

import {
  OrganizerAttendeesContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerAttendeesPage() {
  return (
    <>
      <Head>
        <title>Organizer Attendees | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Attendees")}
            profile={organizerProfile}
          />
          <OrganizerAttendeesContent />
        </div>
      </main>
    </>
  );
}
