import Head from "next/head";

import {
  OrganizerDashboardSidebar,
  OrganizerTicketsContent,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerTicketsPage() {
  return (
    <>
      <Head>
        <title>Organizer Tickets | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Tickets")}
            profile={organizerProfile}
          />
          <OrganizerTicketsContent />
        </div>
      </main>
    </>
  );
}
