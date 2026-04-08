import Head from "next/head";

import {
  OrganizerCreateEventStepFourContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerCreateEventTicketsPricingPage() {
  return (
    <>
      <Head>
        <title>Create Event - Tickets & Pricing | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Events")}
            profile={organizerProfile}
          />
          <OrganizerCreateEventStepFourContent />
        </div>
      </main>
    </>
  );
}
